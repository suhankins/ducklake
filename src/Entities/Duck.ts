import { Clock, Euler, Object3D, Sphere, Vector3 } from 'three';
import Bread from './Bread';
import { PhysicsEntity } from './PhysicsEntity';
import { State, StateIdle } from './DuckStates';

export default class Duck extends PhysicsEntity {
    static DUCKS: { [id: number]: Duck } = {};

    name: string = 'duck';

    collision: Sphere;

    velocity: Vector3 = new Vector3();
    angularVelocity: Euler = new Euler();

    terminalVelocity: number = 10;
    angularTerminalVelocity: number = 1;

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

    constructor() {
        super();
        Duck.DUCKS[this.id] = this;
        this.target = new Vector3();
        this.state = new StateIdle(this);
        this.model = Duck.MODEL.clone(true);
        this.collision = new Sphere(this.model.position, 1);
    }

    update(dt: number) {
        this.state.update(dt);
        this.capVelocity();
        this.checkCollisions();
        this.pushAway();
        this.applyVelocity(dt);
    }

    destroy() {
        super.destroy();
        delete Duck.DUCKS[this.id];
    }
}
