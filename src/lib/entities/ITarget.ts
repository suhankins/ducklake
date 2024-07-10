import CollidableEntity from './CollidableEntity';

import type Entity from './Entity';

export default interface ITarget extends CollidableEntity {
    /**
     * Called when entity that targets this ITarget entity reaches it
     * @param reachedBy 
     */
    onReached(reachedBy: Entity): void;
}
