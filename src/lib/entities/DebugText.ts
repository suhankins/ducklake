import Entity from './Entity';
import { CSS2DObject } from 'three/examples/jsm/Addons';

import type Game from '../Game';

export default class DebugText extends Entity {
    name = '';

    element: HTMLElement;
    entity: Entity;
    model: CSS2DObject;

    constructor(game: Game, entity: Entity) {
        super(game);
        this.entity = entity;
        this.element = document.createElement('div');
        this.element.className = 'debug-text';
        this.model = new CSS2DObject(this.element);
        this.model.center.set(0, 0);
    }

    update(): void {
        if (this.entity.shouldBeDeleted || !this.game.debugTextEnabled) {
            this.destroy();
            return;
        }

        this.model.position.copy(this.entity.position);

        this.element.innerHTML = `${this.entity.name} #${this.entity.id}
${this.entity.getDebugString()}`;
    }
}
