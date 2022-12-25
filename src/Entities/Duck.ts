import { Clock, Object3D, Vector2, Vector3 } from 'three';
import Bread from './Bread';
import { PhysicsEntity } from './Entity';
import { State, StateIdle } from './DuckStates';

export default class Duck extends PhysicsEntity {
    model: Object3D;

    // Behaviour
    /**
     * Target, that duck should chase.
     */
    target: Bread | Vector3 | null;

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

    // Movement
    velocity: Vector3 = new Vector3();

    TERMINAL_VELOCITY = 10;

    constructor() {
        super();
        this.target = null;
        this.state = new StateIdle(this);
        this.model = Duck.MODEL.clone(true);
    }

    update(dt: number) {
        this.state.update(dt);
        this.capVelocity(dt);
        this.applyVelocity(dt);
    }

    lookAt(position: Vector3) {
        const convertedVector = position
            .clone()
            .sub(this.model.position) // if we substract one vector from another,
            .setY(0)                  // we get a vector pointing from one to another
            .normalize();
        const angle =
            new Vector2(-convertedVector.x, convertedVector.z).angle() -
            Math.PI / 2;
        this.model.rotation.y = angle;
    }
}
