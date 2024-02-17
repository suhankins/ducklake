import { Vector2 } from 'three';
import { windowToWorld } from './windowToWorld';

export default function getRandomPosition() {
    return windowToWorld(
        new Vector2(
            window.innerWidth * Math.random(),
            window.innerHeight * Math.random()
        )
    );
}
