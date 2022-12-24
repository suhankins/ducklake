import { Clock, Object3D, Vector2, Vector3 } from 'three';
import Bread from './Bread';
import Entity from './Entity';
import { State, StateIdle } from './DuckStates';

export default class Duck extends Entity {
    model: Object3D;

    // Behaviour
    target: Bread | Vector3 | null;

    private _state: State = new StateIdle(this);
    public get state() {
        return this._state;
    }
    public set state(newState: State) {
        this.resetTimeInState();
        this._state = newState;
    }

    private stateEntered: Clock = new Clock();
    public get timeInState() {
        return this.stateEntered.getElapsedTime();
    }
    private resetTimeInState() {
        this.stateEntered.start();
    }

    // Movement 
    velocity: Vector3 = new Vector3();

    deceleration = 2;

    idleAcceleration = 1;
    breadAcceleration = 3;

    idleSpeed = 1;
    breadSpeed = 2;

    constructor() {
        super();
        this.target = null;
        this.state = new StateIdle(this);
        this.model = Duck.MODEL.clone(true);
    }

    update(dt: number) {
        //this.state.update(dt);
        //this.applyVelocity(dt);
        //this.decelerate(dt);
    }

    lookAt(position: Vector3) {
        const convertedVector = position.clone().sub(this.model.position).setY(0).normalize();
        const angle = new Vector2(-convertedVector.x, convertedVector.z).angle() - Math.PI / 2;
        this.model.rotation.y = angle;
    }
}