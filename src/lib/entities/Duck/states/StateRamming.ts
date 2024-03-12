import StateApproachingTarget from './StateApproachingTarget';

import type Duck from '../Duck';
import type INextStateFactory from './INextStateFactory';
import type { Vector3 } from 'three';

/**
 * Duck will "attack" another duck but very quickly ramming it.
 *
 * I hope it doesn't look like bullying or ducks fighting. It's all in good fun.
 */
export default class StateRamming extends StateApproachingTarget {
    /**
     * Time after which duck should give up on chasing
     * @constant
     */
    static TIRED_OF_CHASING_IN_SECONDS = 9;
    /**
     * @constant
     */
    static TERMINAL_VELOCITY = 2.5;
    /**
     * Distance duck could potentially cover in this state
     * @constant
     */
    static POSSIBLE_DISTANCE =
        StateRamming.TIRED_OF_CHASING_IN_SECONDS *
        StateRamming.TERMINAL_VELOCITY;

    /**
     * Calculates if it's likely that duck will
     * end up ramming another duck if it enters this state
     * @param ourPosition
     * @param theirPosition
     * @returns if it's likely that target position will be reached
     */
    static willTheTargetBeReached(
        ourPosition: Vector3,
        theirPosition: Vector3
    ): boolean {
        const distance = ourPosition.distanceTo(theirPosition);
        return distance < StateRamming.POSSIBLE_DISTANCE;
    }

    constructor(duck: Duck, target: Duck, state: INextStateFactory) {
        super(duck, target, state, true);
        this.horizontalTerminalVelocity = StateRamming.TERMINAL_VELOCITY;
        this.rotationSpeed = 0.9;
        this.duck.quack();
    }

    update(dt: number): void {
        if (this.duck.timeInState > StateRamming.TIRED_OF_CHASING_IN_SECONDS) {
            // TODO: Disappointed state
            this.duck.state = this.nextStateFactory();
            return;
        }
        super.update(dt);
    }
}
