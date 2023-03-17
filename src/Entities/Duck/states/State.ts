import Duck from '../Duck';

/**
 * State that control duck's behaviour
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
