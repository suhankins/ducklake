import LaughterHtml from './Laughter.html?raw';
import VFX from '../VFX';

import type Duck from '../../Duck/Duck';
import type Game from '../../../Game';

export default class Laughter extends VFX {
    name = 'laughter';

    duck: Duck;

    timer = 3;

    constructor(game: Game, duck: Duck) {
        super(game, LaughterHtml);

        this.duck = duck;

        this.updateTransform();
        this.model.center.set(-0.5, 0.5);
    }

    update(dt: number): void {
        this.updateTransform();
        super.update(dt);
    }

    updateTransform() {
        this.position
            .set(0, 2, 1.5)
            .applyEuler(this.duck.rotation)
            .add(this.duck.position);
    }
}
