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

    static ROTATION_THRESHOLD = 0.01;
    static POSITION_THRESHOLD = 0.1;

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
        var desiredPosition: Vector3;

        if (this.duck.target instanceof Vector3) {
            desiredPosition = this.duck.target;
            if (
                desiredPosition
                    .clone()
                    .sub(this.duck.model.position)
                    .length() <= StateApproachingTarget.POSITION_THRESHOLD
            ) {
                this.duck.state = new this.stateToEnter(this.duck);
            }
        } else if (this.duck.target instanceof Bread) {
            desiredPosition = this.duck.target.model.position;
        }

        const currentAngle = // To account for multiple circles of rotation and negative angles
            (this.duck.model.rotation.y % (Math.PI * 2)) + Math.PI * 2;

        this.duck.velocity.addScaledVector(
            new Vector3(Math.sin(currentAngle), 0, Math.cos(currentAngle)),
            this.acceleration * dt
        );

        const desiredAngle = this.duck.angleTowards(desiredPosition);

        var difference = currentAngle - desiredAngle;
        if (difference > Math.PI)
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
                        dt * // duck will rotate in the direction that will get it to the desired angle asap
                        (difference > 0 && difference < Math.PI ? -1 : 1),
                0
            );
        }
    }
}
