import { Vector3 } from "three";

export default function WindowToWorld(x: number, y: number): Vector3 {
    x -= window.innerWidth / 2;
    x /= 3.9;
    y -= window.innerHeight / 2;

    const pixelsPerUnit = 50 / window.innerHeight;

    return new Vector3(
        (y / 2 + x) * pixelsPerUnit,
        0,
        (y / 2 - x) * pixelsPerUnit
    );
}