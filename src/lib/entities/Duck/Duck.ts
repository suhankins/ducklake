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
import formatEntityName from '../../utils/formatEntityName';

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
    /**
     * Objects beak collided with during last frame
     */
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
        this.stateEnteredTimeStamp.start();
        this._state = newState;
    }

    private stateEnteredTimeStamp: Clock = new Clock();
    /**
     * Time which duck has spent in the current state.
     */
    public get timeInState() {
        return this.stateEnteredTimeStamp.getElapsedTime();
    }

    private _currentEmote: null | Entity = null;
    /**
     * Entity representing duck's current emotion (usually VFX)
     */
    public set currentEmote(thought: null | Entity) {
        if (this._currentEmote !== null) {
            this._currentEmote.destroy();
        }
        this._currentEmote = thought;
        this.lastEmoteClock.start();
    }
    public get currentEmote() {
        return this._currentEmote;
    }
    private lastEmoteClock = new Clock();
    public get timeSinceLastEmote() {
        return this.lastEmoteClock.getElapsedTime();
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
        this.beakCollision.center
            .set(0, 0, 1)
            .applyEuler(this.rotation)
            .add(this.position);
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

    emote(emotion: Entity) {
        this.currentEmote = emotion;
        this.game.addEntity(emotion);
    }

    onThoughtDestroyed(prematurely: boolean) {
        this.state.onThoughtDestoyed(prematurely);
    }

    onReached(reachedBy: Entity) {
        this.state.onReached(reachedBy);
    }

    getDebugString(): string {
        return `State: ${this.state.name}
Time in state: ${this.timeInState.toFixed(2)}
Target: ${formatEntityName(this.target)}
Hunger: ${this.isHungry ? 'VERY HUNGRY' : this.hunger.toFixed(2)}
Last emote: ${this.timeSinceLastEmote.toFixed(2)}
Current emote: ${formatEntityName(this.currentEmote)}`;
    }

    destroy() {
        super.destroy();
        delete Duck.ducks[this.id];
    }
}
