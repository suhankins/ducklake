import { Vector3 } from 'three';
import Duck from '../../Duck';
import { IState, State } from '../State';
import { getAngleTowards, lerpAngle } from '../../../../utils/AngleHelpers';
import type ITarget from '../../../ITarget';

/**
 * Duck moves towards its target
 * 
 * Duck enters next state when:
 * * Target has been reached
 * * Target is gone
 * * Duck is very hungry
 */
export class StateApproachingTarget extends State {
    name: string = 'approaching target';

    isEager: boolean;

    stateToEnter: IState;

    acceleration: number;
    rotationSpeed: number;

    static ROAMING_ACCELERATION = 1;
    static CHASE_ACCELERATION = 3;

    static ROAMING_TERMINAL_VELOCITY = 1.5;
    static CHASE_TERMINAL_VELOCITY = 2;

    static ROAMING_ROTATION = 0.3;
    static CHASE_ROTATION = 0.6;

    /**
     * @param duck
     * @param target Target that duck should approach
     * @param state state to which duck should transition after reaching target
     * @param isEager should duck approach target qucikly
     */
    constructor(
        duck: Duck,
        target: ITarget,
        state: IState,
        isEager: boolean = false
    ) {
        super(duck);
        this.target = target;
        this.stateToEnter = state;
        this.isEager = isEager;
        if (isEager) {
            this.acceleration = StateApproachingTarget.CHASE_ACCELERATION;
            this.duck.terminalVelocity =
                StateApproachingTarget.CHASE_TERMINAL_VELOCITY;
            this.rotationSpeed = StateApproachingTarget.CHASE_ROTATION;
        } else {
            this.acceleration = StateApproachingTarget.ROAMING_ACCELERATION;
            this.duck.terminalVelocity =
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
            this.target!.targetReached();
            this.target = null;
            this.enterNextState();
            return;
        }

        this.updateRotationAndVelocity(dt);
    }

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
        const targetAngle = getAngleTowards(
            this.position,
            this.target!.position
        );
        this.rotation.y = lerpAngle(
            this.rotation.y,
            targetAngle,
            dt * this.rotationSpeed
        );

        this.addLinearAccelerationToVelocity(dt);
    }

    enterNextState() {
        this.duck.terminalVelocity = Duck.DEFAULT_TERMINAL_VELOCITY;
        this.duck.state = new this.stateToEnter(this.duck);
    }

    addLinearAccelerationToVelocity(dt: number) {
        this.velocity.addScaledVector(
            new Vector3(
                Math.sin(this.rotation.y),
                0,
                Math.cos(this.rotation.y)
            ),
            this.acceleration * dt
        );
    }
}
