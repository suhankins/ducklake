import PopHtml from './Pop.html?raw';
import Entity from '../Entity';
import { CSS2DObject } from 'three/examples/jsm/Addons';

import { type Vector3 } from 'three';
import type Game from '../../Game';

/**
 * Pop visual effect
 */
export default class Pop extends Entity {
    name = 'pop';

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

    
    getDebugString(): string {
        return `Time left: ${this.timer.toFixed(2)}`
    }
}
