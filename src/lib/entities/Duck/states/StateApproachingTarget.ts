import { Vector3 } from 'three';
import Bread from '../../Bread';
import { PhysicsEntity } from '../../PhysicsEntity';
import Duck from '../Duck';
import { IState, State } from './State';

/**
 * * Duck moves towards its target
 * * Once it reaches its target, duck enters the given state
 */
export class StateApproachingTarget extends State {
    name: string = 'approaching target';

    mode: 'idle' | 'chase';

    stateToEnter: IState;

    acceleration: number;

    angularAcceleration = 1;

    static IDLE_ACCELERATION = 1;
    static CHASE_ACCELERATION = 3;

    static IDLE_SPEED = 1;
    static CHASE_SPEED = 2;

    static ROTATION_THRESHOLD = 0.005;
    static POSITION_THRESHOLD = 1;

    /**
     * @param duck
     * @param target Target that duck should approach
     * @param state state to which duck should transition after reaching target
     */
    constructor(duck: Duck, target: Vector3 | Bread, state: IState) {
        super(duck);
        this.duck.target = target;
        this.stateToEnter = state;
        if (this.duck.target instanceof Vector3) {
            this.mode = 'idle';
            this.duck.target.y = 0;
            this.acceleration = StateApproachingTarget.IDLE_ACCELERATION;
        } else {
            this.mode = 'chase';
            this.acceleration = StateApproachingTarget.CHASE_ACCELERATION;
        }
    }

    update(dt: number): void {
        let desiredPosition: Vector3;

        if (this.target instanceof Vector3) {
            desiredPosition = this.target;
            if (
                desiredPosition.clone().sub(this.duck.position).length() <=
                StateApproachingTarget.POSITION_THRESHOLD
            ) {
                this.duck.state = new this.stateToEnter(this.duck);
            }
        } else {
            desiredPosition = this.target.model.position;
        }

        this.velocity.addScaledVector(
            new Vector3(
                Math.sin(this.rotation.y),
                0,
                Math.cos(this.rotation.y)
            ),
            this.acceleration * dt
        );

        const targetAngle = this.duck.getAngleTowards(desiredPosition);
        const angleDifference = PhysicsEntity.getAngleDifference(
            targetAngle,
            this.rotation.y
        );
        const proportionalTerm = angleDifference * this.angularAcceleration;
        const acceleration =
            Math.min(
                Math.abs(proportionalTerm),
                this.duck.angularTerminalVelocity
            ) * Math.sign(proportionalTerm);

        this.angularVelocity.y =
            this.angularVelocity.y + acceleration * dt;

        if (
            Math.abs(angleDifference) <
            StateApproachingTarget.ROTATION_THRESHOLD
        ) {
            // Stop duck from jerking back and forth
            this.angularVelocity.set(0, 0, 0);
            this.rotation.y = targetAngle; // Looks a bit rough stopping it like that
        } else if (
            Math.abs(this.angularVelocity.y) >
            Math.abs(angleDifference) / dt
        ) {
            this.angularVelocity.y = angleDifference / dt;
        }
    }
}