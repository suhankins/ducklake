import { Vector3 } from 'three';
import { WorldToWindow } from './WindowToWorld';

// Just guesswork. WorldToWindow is very inaccurate.
const THRESHOLD = 100;

export default function isPositionOutsideScreen(position: Vector3) {
    const windowPosition = WorldToWindow(position);
    return (
        windowPosition.x < 0 - THRESHOLD ||
        windowPosition.x > window.innerWidth + THRESHOLD ||
        windowPosition.y < 0 - THRESHOLD ||
        windowPosition.y > window.innerHeight + THRESHOLD
    );
}
