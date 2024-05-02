import { Clock, Object3D, Sphere, Vector3 } from 'three';
import Bread from '../Bread';
import PhysicsEntity from '../PhysicsEntity';
import StateIdle from './states/StateIdle';
import {
    getAngleTowards,
    getRandomAngle,
    lerpAngle,
} from '../../utils/MathHelpers';
import Speech from '../VFX/Speech/Speech';
import Thought from '../VFX/Thought/Thought';

import type ITarget from '../ITarget';
import type Game from '../../Game';
import type Entity from '../Entity';
import type State from './states/State';

export default class Duck extends PhysicsEntity implements ITarget {
    name = 'duck';

    static ducks: { [id: number]: Duck } = {};

    collision: Sphere;
    mass = 20;

    velocity: Vector3 = new Vector3();

    get horizontalTerminalVelocity() {
        return this.state.horizontalTerminalVelocity;
    }
    get deceleration() {
        return this.state.deceleration;
    }

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
    hunger: number = Math.random() * 20 + 20;
    get isHungry() {
        return this.hunger < Duck.HUNGRY_THRESHOLD;
    }
    /**
     * Threshold at which duck will get hungry
     */
    static HUNGRY_THRESHOLD = 0;

    private _state: State = new StateIdle(this);
    /**
     * Duck's state. Controls its behaviour.
     */
    public get state() {
        return this._state;
    }
    public set state(newState: State) {
        this.stateEntered.start();
        this._state = newState;
    }

    private stateEntered: Clock = new Clock();
    /**
     * Time which duck has spent in the current state.
     */
    public get timeInState() {
        return this.stateEntered.getElapsedTime();
    }

    constructor(game: Game, position?: Vector3) {
        super(game);
        Duck.ducks[this.id] = this;
        this.state = new StateIdle(this);
        this.model = Duck.MODEL.clone(true);
        this.position.copy(position ?? new Vector3());
        this.rotation.set(0, getRandomAngle(), 0);
        // Position remains a reference, so we never have to update it
        this.collision = new Sphere(this.model.position, 1);
        this.beakCollision = new Sphere(this.position.clone(), 0.5);
        this.updateBeak();
    }

    update(dt: number) {
        this.decelerate(dt);
        this.updateGravity(dt);
        this.updateHunger(dt);
        this.state.update(dt);
        this.capVelocity();
        this.checkCollisions();
        this.pushAway();
        this.applyVelocity(dt);
    }

    /**
     * Updates beak's position and beak collision list
     */
    updateBeak() {
        this.beakCollision.center.set(0, 0, 1).applyEuler(this.rotation).add(this.position);
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
            dt * this.state.rotationSpeed
        );
    }

    quack() {
        this.game.addEntity(new Speech(this.game, this));
    }

    think() {
        this.game.addEntity(new Thought(this.game, 'bread', this));
    }

    onReached(reachedBy: Entity) {
        this.state.onReached(reachedBy);
    }

    getDebugString(): string {
        return `State: ${this.state.name}
Time in state: ${this.timeInState.toFixed(2)}
Target: ${this.target?.name} #${this.target?.id}
Hunger: ${this.isHungry ? 'VERY HUNGRY' : this.hunger.toFixed(2)}
Angle: ${this.rotation.y.toFixed(2)}`;
    }

    destroy() {
        super.destroy();
        delete Duck.ducks[this.id];
    }
}
