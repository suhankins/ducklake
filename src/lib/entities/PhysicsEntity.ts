import { Sphere, Vector2, Vector3 } from 'three';
import { Entity } from './Entity';

export abstract class PhysicsEntity extends Entity {
    abstract name: string;
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
     *
     */
    static readonly WATER_PRESSURE = 40;
    /**
     * List used for collision detection
     */
    static CollisionList: { [id: number]: PhysicsEntity } = {};
    abstract collision: Sphere;
    /**
     * Determines how hard should this object push other objects
     */
    abstract mass: number;
    /**
     * Array of physics entities this entity collided with in this frame
     */
    collisions: PhysicsEntity[] = [];

    /**
     * Creates a new physics entity, adding it to the list of collidable entities
     */
    constructor() {
        super();
        PhysicsEntity.CollisionList[this.id] = this;
    }

    /**
     * Checks with which objects did this object collide in this frame
     */
    checkCollisions() {
        // resetting previous frame's collisions
        this.collisions = [];
        for (let id in PhysicsEntity.CollisionList) {
            if (
                this.id !== parseInt(id) &&
                PhysicsEntity.CollisionList[id].collision.intersectsSphere(
                    this.collision
                )
            ) {
                this.collisions.push(PhysicsEntity.CollisionList[id]);
            }
        }
    }

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
            this.enteredWater();
            this.velocity.y /= 2;
        }
    }

    /**
     * Callback for when the entity has entered water
     */
    enteredWater() {}

    /**
     * Pushes entities this object collided with away
     * @param dt delta time
     */
    pushAway(dt: number) {
        this.collisions.forEach((entity) => {
            const direction = entity.position
                .clone()
                .sub(this.position)
                .normalize();
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

        function decelerateAxis(axisVelocity: number): number {
            if (Math.abs(axisVelocity) < frameDeceleration) axisVelocity = 0;
            else if (axisVelocity > 0) axisVelocity -= frameDeceleration;
            else axisVelocity += frameDeceleration;

            return axisVelocity;
        }

        this.velocity.x = decelerateAxis(this.velocity.x);
        this.velocity.z = decelerateAxis(this.velocity.z);
    }

    destroy(): void {
        super.destroy();
        delete PhysicsEntity.CollisionList[this.id];
    }

    /**
     * Calculates difference between two given angles
     */
    static getAngleDifference(a: number, b: number): number {
        const twoPi = 2 * Math.PI;
        const difference = (((a - b) % twoPi) + twoPi) % twoPi;
        if (difference > Math.PI) return difference - twoPi;
        return difference;
    }
}
