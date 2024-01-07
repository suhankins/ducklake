import { Vector2 } from 'three';

import type { Vector3 } from 'three';

/**
 * Lerp but between angles
 */
export function lerpAngle(start: number, end: number, alpha: number) {
    const startVector = new Vector2(1, 0).rotateAround(new Vector2(), start);
    const endVector = new Vector2(1, 0).rotateAround(new Vector2(), end);
    const lerpedVector = startVector.lerp(endVector, alpha);
    return lerpedVector.angle();
}

/**
 * Calculates Y angle towards the given position
 */
export function getAngleTowards(a: Vector3, b: Vector3) {
    const convertedVector = b
        .clone()
        .sub(a) // if we substract one vector from another, we get a vector pointing from one to another
        .setY(0)
        .normalize();
    const angle = new Vector2(convertedVector.z, convertedVector.x).angle();
    return angle;
}
