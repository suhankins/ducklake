import Entity from '../Entity';
import Pop from '../Pop/Pop';
import Ripple from '../Ripple';

import { Object3D, type Vector3 } from 'three';
import type Game from '../../Game';

export default class DuckSpawner extends Entity {
    name = 'duck spawner';

    model: Object3D;
    timer: number;

    constructor(game: Game, position: Vector3, timer: number) {
        super(game);
        this.model = new Object3D();
        this.position.copy(position);
        this.timer = timer;
    }

    update(dt: number): void {
        this.timer -= dt;
        if (this.timer < 0) {
            this.game.spawnDuck(this.position);
            this.game.addEntity(new Pop(this.game, this.position, true));
            this.game.addEntity(
                new Ripple(this.game, this.position, 0.7, 1.8, 1)
            );
            this.destroy();
        }
    }

    getDebugString(): string {
        return `Time left: ${this.timer.toFixed(2)}`
    }
}
