import PopHtml from './Speech.html?raw';
import Entity from '../Entity';
import { CSS2DObject } from 'three/examples/jsm/Addons';
import Duck from '../Duck/Duck';
import { Vector3 } from 'three';

import type Game from '../../Game';

export default class Speech extends Entity {
    name = 'speech';

    model: CSS2DObject;
    element: HTMLElement;
    duck: Duck;

    timer = 2;

    constructor(game: Game, duck: Duck) {
        super(game);
        this.element = document.createElement('div');
        this.element.className = 'vfx-wrapper';
        this.element.innerHTML = PopHtml;

        this.duck = duck;

        this.model = new CSS2DObject(this.element);
        this.updateTransform();
        this.model.center.set(0, 0);
    }

    update(dt: number): void {
        this.updateTransform();
        this.timer -= dt;
        if (this.timer <= 0) {
            this.destroy();
        }
    }

    updateTransform() {
        this.position.copy(
            new Vector3(0, 2, 2)
                .applyEuler(this.duck.rotation)
                .add(this.duck.position)
        );
        //this.duck.rotation.y = 0;
        this.element.style.setProperty('--rotation', `${-this.duck.rotation.y + Math.PI * 0.75}rad`);
    }

    getDebugString(): string {
        return `Time left: ${this.timer.toFixed(2)}`;
    }
}
