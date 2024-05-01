import ThoughtHtml from './Thought.html?raw';
import VFX from '../VFX';

import type Duck from '../../Duck/Duck';
import type Game from '../../../Game';

export default class Thought extends VFX {
    name = 'thought';

    duck: Duck;

    timer = 8;

    constructor(game: Game, duck: Duck) {
        super(game, ThoughtHtml, ['thought-wrapper']);

        this.duck = duck;

        this.updateTransform();
        this.model.center.set(-0.5, 0.5);
        this.element.style.setProperty('--on-screen-for', `${this.timer}s`);
    }

    update(dt: number): void {
        this.updateTransform();
        super.update(dt);
    }

    updateTransform() {
        this.position
            .set(0, 2.3, 1.5)
            .applyEuler(this.duck.rotation)
            .add(this.duck.position);
    }
}
