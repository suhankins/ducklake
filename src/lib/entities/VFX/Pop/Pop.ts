import PopHtml from './Pop.html?raw';
import VFX from '../VFX';

import { type Vector3 } from 'three';
import type Game from '../../../Game';

/**
 * Pop visual effect
 */
export default class Pop extends VFX {
    name = 'pop';

    timer = 1;

    constructor(game: Game, position: Vector3, bigger?: boolean) {
        super(game, PopHtml, bigger ? ['bigger'] : undefined);

        this.model.position.copy(position);
        this.model.center.set(0, 0);
    }
}
