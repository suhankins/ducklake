import AngerHtml from './Anger.html?raw';
import VFX from '../VFX';

import type Duck from '../../Duck/Duck';
import type Game from '../../../Game';

export default class Anger extends VFX {
    name = 'anger';

    duck: Duck;

    timer = 8;

    constructor(game: Game, duck: Duck, timer?: number) {
        super(game, AngerHtml);

        this.duck = duck;
        if (timer) {
            this.timer = timer;
        }

        this.updateTransform();
        this.model.center.set(0.5, 0.5);

        this.element.style.setProperty('--on-screen-for', `${this.timer}s`);
    }

    update(dt: number): void {
        this.updateTransform();
        super.update(dt);
    }

    updateTransform() {
        this.position
            .set(0, 2.25, 1.5)
            .applyEuler(this.duck.rotation)
            .add(this.duck.position);
    }
}
