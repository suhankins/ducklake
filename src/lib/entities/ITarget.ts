import CollidableEntity from './CollidableEntity';

import type Entity from './Entity';

export default interface ITarget extends CollidableEntity {
    onReached(reachedBy: Entity): void;
}
