import Duck from '../Duck';

/**
 * State that controls duck's behaviour
 */
export abstract class State {
    /**
     * Mainly used for debug
     */
    abstract name: string;

    /**
     * Duck that this state updates
     */
    duck: Duck;

    public get velocity() {
        return this.duck.velocity;
    }
    public get position() {
        return this.duck.position;
    }
    public get target() {
        return this.duck.target;
    }
    public get rotation() {
        return this.duck.rotation;
    }

    constructor(duck: Duck) {
        this.duck = duck;
    }

    /**
     * Called every tick, updates duck's state
     * @param dt delta time
     */
    abstract update(dt: number): void;
}

export interface IState {
    new (duck: Duck): State;
}
