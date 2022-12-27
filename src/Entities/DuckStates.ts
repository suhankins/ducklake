import { Vector3 } from 'three';
import WindowToWorld from '../WindowToWorld';
import Bread from './Bread';
import Duck from './Duck';

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

    constructor(duck: Duck, dontMove: boolean = false) {
        super(duck);
        if (dontMove) this.randomMovementTime = 9999999999999;
    }

    update(dt: number): void {
        this.duck.decelerate(dt);

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

    acceleration: number;

    angularAcceleration = 2;

    static IDLE_ACCELERATION = 1;
    static CHASE_ACCELERATION = 3;

    static IDLE_SPEED = 1;
    static CHASE_SPEED = 2;

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
            this.duck.terminalVelocity = StateApproachingTarget.IDLE_SPEED;
            this.acceleration = StateApproachingTarget.IDLE_ACCELERATION;
        } else {
            this.mode = 'chase';
            this.duck.terminalVelocity = StateApproachingTarget.CHASE_SPEED;
            this.acceleration = StateApproachingTarget.CHASE_ACCELERATION;
        }
    }

    update(dt: number): void {
        const desiredPosition: Vector3 =
            this.duck.target instanceof Vector3
                ? this.duck.target
                : this.duck.target.model.position;
        const currentAngle =
            Math.abs(this.duck.model.rotation.y) % (Math.PI * 2); // To account for multiple circles of rotation

        this.duck.velocity.addScaledVector(
            new Vector3(Math.sin(currentAngle), 0, Math.cos(currentAngle)),
            this.acceleration * dt
        );

        const desiredAngle = this.duck.angleTowards(desiredPosition);

        var difference = currentAngle - desiredAngle;
        if (Math.abs(difference) > Math.PI)
            difference += (difference > 0 ? -1 : 1) * Math.PI * 2; // Keeps difference between -PI and +PI
        if (Math.abs(difference) < 0.01) {
            // Stop duck from jerking back and forth
            this.duck.angularVelocity.set(0, 0, 0);
            this.duck.model.rotation.y = desiredAngle; // Looks a bit rough stopping it like that
        } else {
            this.duck.angularVelocity.set(
                0,
                this.duck.angularVelocity.y +
                    this.angularAcceleration *
                        dt * // Line below prevents duck from getting stuck in angle PI radians different from target
                        (Math.abs(difference) > Math.PI - 0.01 ? -1 : 1) *
                        (difference > 0 ? -1 : 1), // Reversing rotation if difference > 2*PI
                0
            );
        }
    }
}
