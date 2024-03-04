import Entity from './Entity';

import type { Sphere } from 'three';
import type Game from '../Game';

export default abstract class CollidableEntity extends Entity {
    /**
     * List used for collision detection
     */
    static CollisionList: { [id: number]: CollidableEntity } = {};
    abstract collision: Sphere;
    /**
     * Array of physics entities this entity has collided with in this frame
     */
    collisions: CollidableEntity[] = [];

    /**
     * Checks with which entities did this entity collide with in this frame
     */
    checkCollisions() {
        // resetting previous frame's collisions
        this.collisions = [];
        for (let id in CollidableEntity.CollisionList) {
            if (this.id === parseInt(id)) {
                continue;
            }
            const entity = CollidableEntity.CollisionList[id];
            if (entity.collision.intersectsSphere(this.collision)) {
                this.collisions.push(entity);
            }
        }
    }

    /**
     * Creates a new collidable entity, adding it to the list of collidable entities
     */
    constructor(game: Game) {
        super(game);
        CollidableEntity.CollisionList[this.id] = this;
    }

    destroy(): void {
        super.destroy();
        delete CollidableEntity.CollisionList[this.id];
    }
}
