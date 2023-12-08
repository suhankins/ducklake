import { Clock, Object3D, Sphere, Vector3 } from 'three';
import Bread from '../Bread';
import { PhysicsEntity } from '../PhysicsEntity';
import { State } from './states/State';
import { StateIdle } from './states/StateIdle';

export default class Duck extends PhysicsEntity {
    static DUCKS: { [id: number]: Duck } = {};

    name: string = 'duck';

    collision: Sphere;
    mass = 20;

    velocity: Vector3 = new Vector3();
    terminalVelocity: number = 1.5;
    deceleration: number = 0.1;

    model: Object3D;

    // Behaviour
    /**
     * Target, that duck should chase.
     */
    target: Bread | Vector3;

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

    constructor(position?: Vector3) {
        super();
        Duck.DUCKS[this.id] = this;
        this.target = new Vector3();
        this.state = new StateIdle(this);
        this.model = Duck.MODEL.clone(true);
        this.position = position ?? new Vector3();
        this.collision = new Sphere(this.model.position, 1);
    }

    update(dt: number) {
        this.decelerate(dt);
        this.updateGravity(dt);
        this.state.update(dt);
        this.capVelocity();
        this.checkCollisions();
        this.pushAway(dt);
        this.applyVelocity(dt);
    }

    destroy() {
        super.destroy();
        delete Duck.DUCKS[this.id];
    }
}
