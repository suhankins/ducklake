import Bread from '../../Bread';
import State from './State';
import StateApproachingTarget from './StateApproachingTarget';
import getRandomPosition from '../../../utils/getRandomPosition';
import RoamingTarget from '../../RoamingTarget';
import StateApproachingBread from './StateApproachingBread';
import Thought from '../../VFX/Thought/Thought';
import { randomRange } from '../../../utils/MathHelpers';
import Duck from '../Duck';

import type Entity from '../../Entity';
import StateShocked from './StateShocked';

/**
 * * Duck waits for up to 10 seconds to move randomly on the screen
 */
export default class StateIdle extends State {
    name = 'idle';

    randomMovementTime: number = Math.random() * 10;

    constructor(duck: Duck) {
        super(duck);
    }

    update(): void {
        if (this.duck.isHungry) {
            if (Bread.breadsExist) {
                this.duck.quack();
                if (this.duck.currentEmote !== null) {
                    this.duck.currentEmote.destroy();
                }
                this.setStateToApproachClosestBread(true);
                return;
            } else if (
                this.duck.currentEmote === null &&
                this.duck.timeSinceLastEmote > 20
            ) {
                this.duck.emote(new Thought(this.game, 'bread', this.duck));
            }
        }

        if (this.duck.timeInState > this.randomMovementTime) {
            if (Math.random() > 0.5) {
                this.duck.quack();
            }
            if (Bread.breadsExist) {
                this.setStateToApproachClosestBread();
                return;
            }
            this.setStateToApproachRandomPosition();
        }
    }

    setStateToApproachRandomPosition() {
        this.duck.state = new StateApproachingTarget(
            this.duck,
            this.game.addEntity(
                new RoamingTarget(this.game, this.duck, getRandomPosition())
            ),
            () => new StateIdle(this.duck),
            false,
            randomRange(3, 10)
        );
    }

    setStateToApproachClosestBread(isEager?: boolean) {
        this.duck.state = new StateApproachingBread(
            this.duck,
            Bread.getClosestBreadToPosition(this.position),
            () => new StateIdle(this.duck),
            isEager
        );
    }

    onReached(reachedBy: Entity): void {
        if (reachedBy instanceof Duck && reachedBy.state.name === 'ramming') {
            this.duck.state = new StateShocked(
                this.duck,
                () => new StateIdle(this.duck)
            );
        }
    }

    onThoughtDestoyed(): void {
        this.duck.currentEmote = null;
    }
}
