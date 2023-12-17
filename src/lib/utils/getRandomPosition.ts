import { Vector2 } from 'three';
import { WindowToWorld } from './WindowToWorld';

export function getRandomPosition() {
    return WindowToWorld(
        new Vector2(
            window.innerWidth * Math.random(),
            window.innerHeight * Math.random()
        )
    );
}
