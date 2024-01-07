import { Clock, Euler, Object3D, Sphere, Vector3 } from 'three';
import Bread from '../Bread';
import { PhysicsEntity } from '../PhysicsEntity';
import { State } from './states/State';
import { StateIdle } from './states/StateIdle';
import ITarget from '../ITarget';
import type Game from '../../Game';
import type { Entity } from '../Entity';
import { getAngleTowards, lerpAngle } from '../../utils/AngleHelpers';

export default class Duck extends PhysicsEntity implements ITarget {
    static ducks: { [id: number]: Duck } = {};

    name: string = 'duck';

    collision: Sphere;
    mass = 20;

    velocity: Vector3 = new Vector3();

    static DEFAULT_TERMINAL_VELOCITY = 1.5;
    terminalVelocity: number = Duck.DEFAULT_TERMINAL_VELOCITY;
    deceleration: number = 0.1;

    static DEFAULT_ROTATION_SPEED = 0.3;
    rotationSpeed: number = Duck.DEFAULT_ROTATION_SPEED;

    model: Object3D;

    // Beak
    beakCollision: Sphere;
    beakCollisionList: Bread[] = [];

    // Behaviour
    /**
     * Target, that duck should chase.
     */
    target: ITarget | null = null;

    /**
     * Time until duck gets hungry
     */
    hunger: number = Math.random() * 20;
    /**
     * Threshold at which duck gets hungry enough to care to find bread
     */
    static HUNGRY_THRESHOLD = 0;
    /**
     * Threshold at which duck will get VERY hungry
     */
    static VERY_HUNGRY_THRESHOLD = -30;

    private _state: State = new StateIdle(this);
    /**
     * Duck's state. Controls its behaviour.
     */
    public get state() {
        return this._state;
    }
    public set state(newState: State) {
        this.resetTimeInState();
        this._state = newState;
    }

    private stateEntered: Clock = new Clock();
    /**
     * Time which duck has spent in the current state.
     */
    public get timeInState() {
        return this.stateEntered.getElapsedTime();
    }
    private resetTimeInState() {
        this.stateEntered.start();
    }

    constructor(game: Game, position?: Vector3) {
        super(game);
        Duck.ducks[this.id] = this;
        this.state = new StateIdle(this);
        this.model = Duck.MODEL.clone(true);
        this.position = position ?? new Vector3();
        this.rotation = new Euler(0, Math.random() * Math.PI * 2, 0);
        // Position remains a reference, so we never have to update it
        this.collision = new Sphere(this.model.position, 1);
        this.beakCollision = new Sphere();
        this.updateBeak();
    }

    update(dt: number) {
        this.decelerate(dt);
        this.updateGravity(dt);
        this.updateHunger(dt);
        this.state.update(dt);
        this.capVelocity();
        this.checkCollisions();
        this.pushAway(dt);
        this.applyVelocity(dt);
    }

    /**
     * Updates beak's position and beak collision list
     */
    updateBeak() {
        this.beakCollision.set(
            new Vector3(0, 0, 1).applyEuler(this.rotation).add(this.position),
            0.5
        );
        this.beakCollisionList = [];
        for (let id in Bread.breads) {
            const bread = Bread.breads[id];
            if (this.beakCollision.intersectsSphere(bread.collision)) {
                this.beakCollisionList.push(bread);
            }
        }
    }

    updateHunger(dt: number) {
        this.hunger -= dt;
    }

    rotateTowardsTarget(dt: number) {
        const targetAngle = getAngleTowards(
            this.position,
            this.target!.position
        );
        this.rotation.y = lerpAngle(
            this.rotation.y,
            targetAngle,
            dt * this.rotationSpeed
        );
    }

    onReached(reachedBy: Entity) {
        this.state.onReached(reachedBy);
    }

    isHungry() {
        return this.hunger < Duck.HUNGRY_THRESHOLD;
    }

    isVeryHungry() {
        return this.hunger < Duck.VERY_HUNGRY_THRESHOLD;
    }

    destroy() {
        super.destroy();
        delete Duck.ducks[this.id];
    }
}
