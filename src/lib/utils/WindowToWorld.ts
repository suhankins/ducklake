import { Vector2, Vector3 } from 'three';

const getPixelsPerHeightUnit = () => 50 / window.innerHeight;

/**
 * Transforms window position to position in the world.
 *
 * Very inaccurate, shouldn't be used for anything important.
 * @returns Vector3 of where this window position is in the world
 */
export function WindowToWorld(position: Vector2) {
    const pphu = getPixelsPerHeightUnit();

    const x = (position.x - window.innerWidth / 2) / 3.9;
    const y = (position.y - window.innerHeight / 2) / 2;

    return new Vector3((y + x) * pphu, 0, (y - x) * pphu);
}

/**
 * Inverse of WindowToWorld. Is very inaccurate too.
 */
export function WorldToWindow(position: Vector3) {
    const pphu = getPixelsPerHeightUnit();

    const x = (position.x - position.z) / (2 * pphu);
    const y = (position.x + position.z) / (2 * pphu);

    return new Vector2(
        x * 3.9 + window.innerWidth / 2,
        y * 2 + window.innerHeight / 2
    );
}
