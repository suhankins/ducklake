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

/**
 * Returns a random number in range [0; 2 * PI]
 */
export function getRandomAngle() {
    return Math.random() * Math.PI * 2;
}

export function clamp(x: number, min: number, max: number) {
    if (x >= max) return max;
    if (x <= min) return min;
    return x;
}

export function randomRange(min: number, max: number) {
    return min + Math.random() * (max - min);
}
