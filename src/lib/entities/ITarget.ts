import { CollidableEntity } from './CollidableEntity';

export default interface ITarget extends CollidableEntity {
    targetReached(): void;
}
