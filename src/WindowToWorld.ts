import { Vector3 } from 'three';

/**
 * Transforms window position to position in the world.
 *
 * Very inaccurate, shouldn't be used for anything important.
 * @param x
 * @param y
 * @returns Vector3 of where this window position is in the world
 */
export default function WindowToWorld(x: number, y: number): Vector3 {
    x -= window.innerWidth / 2;
    x /= 3.9;
    y -= window.innerHeight / 2;

    const a = 50 / window.innerHeight;

    return new Vector3((y / 2 + x) * a, 0, (y / 2 - x) * a);
}
