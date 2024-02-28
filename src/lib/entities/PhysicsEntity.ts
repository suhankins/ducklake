import { Vector3 } from 'three';
import CollidableEntity from './CollidableEntity';

export default abstract class PhysicsEntity extends CollidableEntity {
    abstract velocity: Vector3;
    public get speed() {
        return this.velocity.length();
    }
    /**
     * Max speed in, units per second
     */
    abstract terminalVelocity: number;
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
            Math.abs(this.velocity.y) * dt < 0.002
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

    /**
     * Callback for when the entity has entered water
     * @param strength speed, at which entity entered water
     */
    // @ts-expect-error: 'strength' is declared but its value is never read.
    enteredWater(strength: number) {}

    /**
     * Pushes entities this object collided with away
     * @param dt delta time
     */
    pushAway(dt: number) {
        this.collisions.forEach((entity) => {
            if (!(entity instanceof PhysicsEntity)) return;
            const direction = entity.position
                .clone()
                .sub(this.position)
                .normalize();
            // TODO: This calculation is nonsense. Figure out some actual formula
            const force =
                (this.mass / entity.mass) * this.collision.radius * 5 * dt;
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
        // Linear velocity
        if (this.speed > this.terminalVelocity) {
            this.velocity.normalize().multiplyScalar(this.terminalVelocity);
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
