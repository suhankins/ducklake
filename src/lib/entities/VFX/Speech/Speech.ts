import SpeechHtml from './Speech.html?raw';
import { Vector3 } from 'three';
import VFX from '../VFX';

import type Duck from '../../Duck/Duck';
import type Game from '../../../Game';

export default class Speech extends VFX {
    name = 'speech';

    duck: Duck;

    timer = 2;

    constructor(game: Game, duck: Duck) {
        super(game, SpeechHtml);

        this.duck = duck;

        this.updateTransform();
        this.model.center.set(0, 0);
    }

    update(dt: number): void {
        this.updateTransform();
        super.update(dt);
    }

    updateTransform() {
        this.position.copy(
            new Vector3(0, 2, 2)
                .applyEuler(this.duck.rotation)
                .add(this.duck.position)
        );
        this.element.style.setProperty(
            '--rotation',
            `${-this.duck.rotation.y + Math.PI * 0.75}rad`
        );
    }
}
