import Entity from '../Entity';
import { CSS2DObject } from 'three/examples/jsm/Addons';

import type Game from '../../Game';

export default abstract class VFX extends Entity {
    model: CSS2DObject;
    element: HTMLElement;

    abstract timer: number;

    constructor(game: Game, innerHtml: string, classNames: string[] = []) {
        super(game);
        this.element = document.createElement('div');
        this.element.className = ['vfx-wrapper', ...classNames].join(' ');
        this.element.innerHTML = innerHtml;

        this.model = new CSS2DObject(this.element);
    }

    update(dt: number): void {
        this.timer -= dt;
        if (this.timer <= 0) {
            this.destroy();
        }
    }

    getDebugString(): string {
        return `Time left: ${this.timer.toFixed(2)}`;
    }
}
