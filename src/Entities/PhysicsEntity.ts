import { Euler, Sphere, Vector2, Vector3 } from 'three';
import { Entity } from './Entity';

export abstract class PhysicsEntity extends Entity {
    // Basics
    abstract name: string;

    destroy(): void {
        super.destroy();
        delete PhysicsEntity.CollisionList[this.id];
    }

    /**
     * Creates a new physics entity, adding it to the list of collidable entities
     */
    constructor() {
        super();
        PhysicsEntity.CollisionList[this.id] = this;
    }

    // Collision
    /**
     * List used for collision detection
     */
    static CollisionList: { [id: number]: PhysicsEntity } = {};

    abstract collision: Sphere;

    /**
     * Returns a list of entities this object collided with
     * @returns list of PhysicsEntity this object collided with
     */
    checkCollisions(): PhysicsEntity[] {
        let collisions = [];
        for (let id in PhysicsEntity.CollisionList) {
            if (
                PhysicsEntity.CollisionList[id].collision.intersectsSphere(
                    this.collision
                )
            ) {
                collisions.push(PhysicsEntity.CollisionList[id]);
            }
        }
        return collisions;
    }

    // Movement
    abstract velocity: Vector3;
    abstract angularVelocity: Euler;

    /**
     * Max speed in, units per second
     */
    abstract terminalVelocity: number;
    /**
     * Max angular velocity ,in radians per second
     */
    abstract angularTerminalVelocity: number;

    /**
     * Deceleration, in units per second
     */
    abstract deceleration: number;

    /**
     * Adds velocity to the position of the model
     * @param dt delta time
     */
    applyVelocity(dt: number): void {
        this.model.position.addScaledVector(this.velocity, dt);
        this.model.rotation.x += this.angularVelocity.x * dt;
        this.model.rotation.y += this.angularVelocity.y * dt;
        this.model.rotation.z += this.angularVelocity.z * dt;
    }

    /**
     * Prevents velocity from getting too high
     */
    capVelocity(): void {
        // Linear velocity
        if (this.velocity.length() > this.terminalVelocity) {
            this.velocity.normalize().multiplyScalar(this.terminalVelocity);
        }

        // Angular velocity
        const rotationToVector3 = new Vector3().setFromEuler(
            this.angularVelocity
        );
        if (rotationToVector3.length() > this.angularTerminalVelocity) {
            rotationToVector3.normalize().multiplyScalar(this.terminalVelocity);
        }
        this.angularVelocity.setFromVector3(rotationToVector3);
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
        this.velocity.y = decelerateAxis(this.velocity.y);
        this.velocity.z = decelerateAxis(this.velocity.z);
    }

    /**
     * Calculates Y angle towards the given position
     * @param position
     */
    angleTowards(position: Vector3) {
        const convertedVector = position
            .clone()
            .sub(this.model.position) // if we substract one vector from another,
            .setY(0) // we get a vector pointing from one to another
            .normalize();
        const angle = new Vector2(convertedVector.z, convertedVector.x).angle(); // Value from 0 to 2*PI
        return angle;
    }
}
