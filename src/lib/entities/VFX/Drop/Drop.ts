import DropHtml from './Drop.html?raw';
import VFX from '../VFX';

import type Duck from '../../Duck/Duck';
import type Game from '../../../Game';

export default class Drop extends VFX {
    name = 'drop';

    duck: Duck;

    timer = 3;

    constructor(game: Game, duck: Duck, timer?: number) {
        super(game, DropHtml);

        this.duck = duck;
        if (timer) {
            this.timer = timer;
        }

        this.updateTransform();
        this.model.center.set(-0.5, 0.5);
    }

    update(dt: number): void {
        this.updateTransform();
        super.update(dt);
    }

    updateTransform() {
        this.position
            .set(0, 2, 1.3)
            .applyEuler(this.duck.rotation)
            .add(this.duck.position);
    }
}
