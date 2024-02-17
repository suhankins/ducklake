import { type Vector3 } from 'three';
import type Game from '../../Game';
import Entity from '../Entity';
import PopHtml from './Pop.html?raw';
import { CSS2DObject } from 'three/examples/jsm/Addons';

/**
 * Pop visual effect
 */
export default class Pop extends Entity {
    model: CSS2DObject;

    timer = 2;

    constructor(game: Game, position: Vector3) {
        super(game);
        const wrapper = document.createElement('div');
        wrapper.className = 'pop-wrapper';
        wrapper.innerHTML = PopHtml;

        this.model = new CSS2DObject(wrapper);
        this.model.position.copy(position);
        this.model.center.set(0, 0);
    }

    update(dt: number): void {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.destroy();
        }
    }
}
