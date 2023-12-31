import { Vector3 } from 'three';
import Bread from '../../Bread';
import Duck from '../Duck';
import { IState, State } from './State';
import { getAngleTowards, lerpAngle } from '../../../utils/AngleHelpers';
import type ITarget from '../../ITarget';

/**
 * * Duck moves towards its target
 * * Once it reaches its target, duck enters the given state
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

    static ROAMING_ROTATION = 0.25;
    static CHASE_ROTATION = 0.5;

    static POSITION_THRESHOLD = 1;

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
        if (this.target === null) {
            this.enterNextState();
            return;
        }

        if (!this.isEager && this.veryHungryCheck()) {
            this.duck.terminalVelocity = Duck.DEFAULT_TERMINAL_VELOCITY;
            this.setStateToApproachClosestBread(true);
            return;
        }

        if (this.isEager && Bread.breadsExist()) {
            this.duck.target = Bread.getClosestBreadToPosition(this.position);
        }

        // Bread should be deleted by now, but we still have it because we think about it
        if (this.target.shouldBeDeleted) {
            if (Bread.breadsExist()) {
                this.setStateToApproachClosestBread(this.isEager);
            } else {
                this.duck.state = new this.stateToEnter(this.duck);
            }
            return;
        }
        // If we touched bread on the previous frame, enter next state
        if (this.target instanceof Bread) {
            this.duck.updateBeak();
            const touchedBread = this.duck.beakCollisionList.at(0);
            if (touchedBread) {
                touchedBread.targetReached();
                this.duck.hunger = Math.random() * 30;
                this.enterNextState();
                return;
            }
        } else {
            if (
                this.duck.collisions.find(
                    (collision) => collision === this.target
                )
            ) {
                this.target.targetReached();
                this.target = null;
                this.enterNextState();
                return;
            }
        }

        /*
         * Rotation
         */
        const targetAngle = getAngleTowards(
            this.position,
            this.target.position
        );
        this.rotation.y = lerpAngle(
            this.rotation.y,
            targetAngle,
            dt * this.rotationSpeed
        );

        /*
         * Linear Velocity
         */
        this.addLinearAccelerationToVelocity(dt);
    }

    enterNextState() {
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

    setStateToApproachClosestBread(isEager?: boolean) {
        this.duck.state = new StateApproachingTarget(
            this.duck,
            Bread.getClosestBreadToPosition(this.position),
            this.stateToEnter,
            isEager
        );
    }
}
