import { Vector3 } from 'three';
import State from './State';
import Duck from '../Duck';

import type INextStateFactory from './INextStateFactory';
import type ITarget from '../../ITarget';
import type IStateGoesBackToIdle from './IStateEntersNextState';

/**
 * Duck moves towards its target
 *
 * Duck enters next state when:
 * * Target has been touched
 * * Target is gone
 * * Duck is very hungry and duck isn't eager to reach given target
 */
export default class StateApproachingTarget extends State implements IStateGoesBackToIdle {
    name: string = 'approaching target';

    isEager: boolean;

    nextStateFactory: INextStateFactory;

    acceleration: number;

    static ROAMING_ACCELERATION = 1;
    static CHASE_ACCELERATION = 2;

    static ROAMING_TERMINAL_VELOCITY = 1.25;
    static CHASE_TERMINAL_VELOCITY = 1.75;

    static ROAMING_ROTATION = 0.5;
    static CHASE_ROTATION = 0.7;

    /**
     * @param duck
     * @param target Target that duck should approach
     * @param state state to which duck should transition after reaching target
     * @param isEager should duck approach target qucikly
     */
    constructor(
        duck: Duck,
        target: ITarget,
        state: INextStateFactory,
        isEager: boolean = false
    ) {
        super(duck);
        this.target = target;
        this.nextStateFactory = state;
        this.isEager = isEager;
        if (isEager) {
            this.acceleration = StateApproachingTarget.CHASE_ACCELERATION;
            this.horizontalTerminalVelocity =
                StateApproachingTarget.CHASE_TERMINAL_VELOCITY;
            this.rotationSpeed = StateApproachingTarget.CHASE_ROTATION;
        } else {
            this.acceleration = StateApproachingTarget.ROAMING_ACCELERATION;
            this.horizontalTerminalVelocity =
                StateApproachingTarget.ROAMING_TERMINAL_VELOCITY;
            this.rotationSpeed = StateApproachingTarget.ROAMING_ROTATION;
        }
    }

    update(dt: number): void {
        if (this.checkForStateTransition()) {
            this.enterNextState();
            return;
        }

        if (this.checkForTargetCollision()) {
            this.onTargetReached();
            this.target!.onReached(this.duck);
            this.target = null;
            this.enterNextState();
            return;
        }

        this.updateRotationAndVelocity(dt);
    }

    /**
     * Gets called when duck reaches its target.
     * 
     * Should be overriden with implementation in ancestors.
     */
    onTargetReached() {}

    checkForTargetCollision() {
        return !!this.duck.collisions.find(
            (collision) => collision === this.target
        );
    }

    checkForStateTransition() {
        return (
            this.target === null ||
            this.target.shouldBeDeleted ||
            (!this.isEager && this.veryHungryCheck())
        );
    }

    updateRotationAndVelocity(dt: number) {
        this.duck.rotateTowardsTarget(dt);

        this.velocity.addScaledVector(
            new Vector3(
                Math.sin(this.rotation.y),
                0,
                Math.cos(this.rotation.y)
            ),
            this.acceleration * dt
        );
    }

    enterNextState() {
        this.duck.state = this.nextStateFactory();
    }
}
