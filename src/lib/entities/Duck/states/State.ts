import Bread from '../../Bread';
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
    public set target(newTarget) {
        this.duck.target = newTarget;
    }
    public get rotation() {
        return this.duck.rotation;
    }
    public get game() {
        return this.duck.game;
    }

    constructor(duck: Duck) {
        this.duck = duck;
    }

    /**
     * Called every tick, updates duck's state
     * @param dt delta time
     */
    abstract update(dt: number): void;

    veryHungryCheck() {
        return this.duck.isVeryHungry() && Bread.breadsExist();
    }
}

export interface IState {
    new (duck: Duck): State;
}
