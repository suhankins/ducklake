import { Vector3 } from 'three';
import WindowToWorld from '../WindowToWorld';
import Bread from './Bread';
import Duck from './Duck';

/**
 * State that control duck's behaviour
 */
export abstract class State {
    abstract name: string;

    duck: Duck;

    constructor(duck: Duck) {
        this.duck = duck;
    }

    abstract update(dt: number): void;
}

interface IState {
    new (duck: Duck): State;
}

/**
 * * Duck waits for up to 10 seconds to move randomly on the screen
 * * Duck decelerates
 */
export class StateIdle extends State {
    name: string = 'idle';

    randomMovementTime: number = Math.random() * 10;

    static DECELERATION = 2;

    decelerate(dt: number): void {
        const length = this.duck.velocity.length();
        if (length == 0) return;
        // stopping any movement, instead of making the duck jump back and forth
        if (length <= StateIdle.DECELERATION * dt)
            this.duck.velocity.set(0, 0, 0);

        this.duck.velocity.subScalar(StateIdle.DECELERATION * dt);
    }

    update(dt: number): void {
        this.decelerate(dt);

        if (this.duck.timeInState > this.randomMovementTime) {
            this.duck.state = new StateApproachingTarget(
                this.duck,
                WindowToWorld(
                    window.innerWidth * Math.random(),
                    window.innerHeight * Math.random()
                ),
                StateIdle
            );
        }
    }
}

/**
 * * Duck moves towards its target
 * * Once it reaches its target, duck enters the given state
 */
export class StateApproachingTarget extends State {
    name: string = 'approaching target';

    mode: 'idle' | 'chase';

    stateToEnter: IState;

    static IDLE_ACCELERATION = 1;
    static CHASE_ACCELERATION = 3;

    static IDLE_SPEED = 1;
    static BREAD_SPEED = 2;

    /**
     * @param duck
     * @param target Target that duck should pursue
     * @param state state to which duck should transition after reaching target
     */
    constructor(duck: Duck, target: Vector3 | Bread, state: IState) {
        super(duck);
        this.duck.target = target;
        this.stateToEnter = state;
        if (target instanceof Vector3) this.mode = 'idle';
        else this.mode = 'chase';
    }

    update(dt: number): void {
        
    }
}
