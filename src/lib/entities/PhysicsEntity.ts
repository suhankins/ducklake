import { Vector2, Vector3 } from 'three';
import CollidableEntity from './CollidableEntity';
import { clamp } from '../utils/MathHelpers';

export default abstract class PhysicsEntity extends CollidableEntity {
    abstract velocity: Vector3;
    public get horizontalVelocity() {
        return new Vector2(this.velocity.x, this.velocity.z);
    }
    public get horizontalSpeed() {
        return this.horizontalVelocity.length();
    }
    public set verticalSpeed(speed: number) {
        this.velocity.y = speed * Math.sign(this.velocity.y);
    }
    public get verticalSpeed() {
        return Math.abs(this.velocity.y);
    }
    /**
     * Max vertical speed, in units per second
     */
    verticalTerminalVelocity: number = 10;
    /**
     * Max horizontal speed, in units per second
     */
    abstract horizontalTerminalVelocity: number;
    /**
     * Deceleration, in units per second
     */
    abstract deceleration: number;
    /**
     * Falling acceleration
     */
    static readonly GRAVITY = -30;
    /**
     * How much upwards acceleration should objects get when under water
     */
    static readonly WATER_PRESSURE = 40;
    /**
     * Determines how hard should this object push other objects
     */
    abstract mass: number;

    /**
     * Applies gravity and water pressure to keep object on the surface of the lake
     * @param dt delta time
     */
    updateGravity(dt: number) {
        // If entity pretty much stopped moving, we stop updating gravity
        if (
            this.position.y >= 0 &&
            this.position.y < 0.05 &&
            this.isYVelocityCloseToZero(dt)
        ) {
            this.velocity.y = 0;
            return;
        }

        // Adding vertical velocity to our bread piece
        let direction: 'up' | 'down';
        if (this.position.y > 0) {
            direction = 'down';
            this.velocity.add(new Vector3(0, PhysicsEntity.GRAVITY * dt, 0));
        } else {
            direction = 'up';
            this.velocity.add(
                new Vector3(0, PhysicsEntity.WATER_PRESSURE * dt, 0)
            );
        }

        // Entity will enter water this frame
        if (direction === 'down' && -this.velocity.y * dt > this.position.y) {
            this.enteredWater(Math.abs(this.velocity.y));
            this.velocity.y /= 2;
        }
    }

    isYVelocityCloseToZero(dt: number) {
        return Math.abs(this.velocity.y) * dt < 0.01;
    }

    /**
     * Callback for when the entity has entered water
     * @param strength speed, at which entity entered water
     */
    // @ts-expect-error: 'strength' is declared but its value is never read.
    enteredWater(strength: number) {}

    /**
     * Pushes entities this object collided with away
     */
    pushAway() {
        this.collisions.forEach((entity) => {
            if (!(entity instanceof PhysicsEntity)) return;
            const direction = entity.position
                .clone()
                .sub(this.position)
                .normalize();
            const force = clamp(this.mass / entity.mass / 2, 0, 3);
            entity.velocity.addScaledVector(direction, force);
        });
    }

    /**
     * Adds velocity to the position of the model
     * @param dt delta time
     */
    applyVelocity(dt: number): void {
        this.position.addScaledVector(this.velocity, dt);
    }

    /**
     * Prevents velocity from getting too high
     */
    capVelocity(): void {
        if (this.horizontalSpeed > this.horizontalTerminalVelocity) {
            const newHorizontalVelocity = this.horizontalVelocity
                .normalize()
                .multiplyScalar(this.horizontalTerminalVelocity);
            this.velocity.x = newHorizontalVelocity.x;
            this.velocity.z = newHorizontalVelocity.y;
        }
        if (this.verticalSpeed > this.verticalTerminalVelocity) {
            this.verticalSpeed = this.verticalTerminalVelocity;
        }
    }

    /**
     * Slows the object down, like friction.
     * @param dt
     */
    decelerate(dt: number): void {
        const length = this.velocity.length();
        if (length == 0) return;

        const frameDeceleration = this.deceleration * dt;

        this.velocity.x = this._decelerateAxis(
            this.velocity.x,
            frameDeceleration
        );
        this.velocity.z = this._decelerateAxis(
            this.velocity.z,
            frameDeceleration
        );
    }

    _decelerateAxis(axisVelocity: number, frameDeceleration: number) {
        if (Math.abs(axisVelocity) < frameDeceleration) axisVelocity = 0;
        else if (axisVelocity > 0) axisVelocity -= frameDeceleration;
        else axisVelocity += frameDeceleration;

        return axisVelocity;
    }
}
