import type Entity from '../entities/Entity';

export default function formatEntityName(entity: Entity | null | undefined) {
    if (!entity) return `none`;
    return `${entity.name} #${entity.id}`;
}
