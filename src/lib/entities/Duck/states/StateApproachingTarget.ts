import { Vector3 } from 'three';
import Bread from '../../Bread';
import Duck from '../Duck';
import { IState, State } from './State';
import { getAngleTowards, lerpAngle } from '../../../utils/AngleHelpers';

/**
 * * Duck moves towards its target
 * * Once it reaches its target, duck enters the given state
 */
export class StateApproachingTarget extends State {
    name: string = 'approaching target';

    isEager: boolean;

    stateToEnter: IState;

    acceleration: number;

    static ROAMING_ACCELERATION = 1;
    static CHASE_ACCELERATION = 3;

    static ROAMING_SPEED = 1;
    static CHASE_SPEED = 2;

    static POSITION_THRESHOLD = 1;

    /**
     * @param duck
     * @param target Target that duck should approach
     * @param state state to which duck should transition after reaching target
     * @param isEager should duck approach target qucikly
     */
    constructor(
        duck: Duck,
        target: Vector3 | Bread,
        state: IState,
        isEager: boolean = false
    ) {
        super(duck);
        this.duck.target = target;
        this.stateToEnter = state;
        this.isEager = isEager;
        if (isEager) {
            this.acceleration = StateApproachingTarget.CHASE_ACCELERATION;
        } else {
            this.acceleration = StateApproachingTarget.ROAMING_ACCELERATION;
        }
    }

    update(dt: number): void {
        if (!this.isEager && this.veryHungryCheck()) {
            this.setStateToApproachClosestBread(true);
            return;
        }

        if (this.isEager && Bread.breadsExist()) {
            this.duck.target = Bread.getClosestBreadToPosition(this.position)
        }

        let desiredPosition: Vector3;

        // If target is a random point on the map
        if (this.target instanceof Vector3) {
            desiredPosition = this.target;
            // If we are within the threshold, enter next state
            if (
                desiredPosition.clone().sub(this.duck.position).length() <=
                StateApproachingTarget.POSITION_THRESHOLD
            ) {
                this.duck.state = new this.stateToEnter(this.duck);
                return;
            }
        } // If target is a bread
        else {
            // Bread should be deleted by now, but we still have it because we think about it
            if (this.target.shouldBeDeleted) {
                if (Bread.breadsExist()) {
                    this.setStateToApproachClosestBread(this.isEager);
                } else {
                    this.duck.state = new this.stateToEnter(this.duck);
                }
                return;
            }
            desiredPosition = this.target.model.position;
            // If we touched bread on the previous frame, enter next state
            const touchedBread = this.duck.beakCollisionList.at(0)
            if (touchedBread) {
                touchedBread.beEaten()
                this.duck.hunger = Math.random() * 30;
                this.duck.state = new this.stateToEnter(this.duck);
                return;
            }
        }

        /*
         * Rotation
         */
        const targetAngle = getAngleTowards(this.position, desiredPosition);
        this.rotation.y = lerpAngle(this.rotation.y, targetAngle, dt / 4);

        /*
         * Linear Velocity
         */
        this.addLinearAccelerationToVelocity(dt);
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
