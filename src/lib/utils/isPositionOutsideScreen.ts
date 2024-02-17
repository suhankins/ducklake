import { Vector3 } from 'three';
import { worldToWindow } from './windowToWorld';

// Just guesswork. WorldToWindow is very inaccurate.
const THRESHOLD = 150;

export default function isPositionOutsideScreen(position: Vector3) {
    const windowPosition = worldToWindow(position);
    return (
        windowPosition.x < 0 - THRESHOLD ||
        windowPosition.x > window.innerWidth + THRESHOLD ||
        windowPosition.y < 0 - THRESHOLD ||
        windowPosition.y > window.innerHeight + THRESHOLD
    );
}
