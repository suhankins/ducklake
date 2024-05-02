import ThoughtHtml from './Thought.html?raw';
import VFX from '../VFX';

import type Duck from '../../Duck/Duck';
import type Game from '../../../Game';
import Pop from '../Pop/Pop';

export default class Thought extends VFX {
    name = 'thought';

    duck: Duck;

    timer = 8;

    constructor(game: Game, subject: string, duck: Duck) {
        super(game, ThoughtHtml.replaceAll('{{SUBJECT}}', subject), [
            'thought-wrapper',
        ]);

        this.duck = duck;

        this.updateTransform();
        this.model.center.set(-0.5, 0.5);
        this.element.style.setProperty('--on-screen-for', `${this.timer}s`);

        this.element.addEventListener('click', () => this.destroy());
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

    destroy(): void {
        if (this.timer > 0) {
            const pop = new Pop(this.game, this.position);
            pop.model.center.set(-0.9, 0.8);
            this.game.addEntity(pop);
        }
        super.destroy();
    }
}
