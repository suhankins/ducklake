import Bread from '../../Bread';
import State from './State';
import StateApproachingTarget from './StateApproachingTarget';
import getRandomPosition from '../../../utils/getRandomPosition';
import RoamingTarget from '../../RoamingTarget';
import StateApproachingBread from './StateApproachingBread';

import type Duck from '../Duck';

/**
 * * Duck waits for up to 10 seconds to move randomly on the screen
 */
export default class StateIdle extends State {
    name = 'idle';

    randomMovementTime: number = Math.random() * 10;

    constructor(duck: Duck, dontMove: boolean = false) {
        super(duck);
        if (dontMove) this.randomMovementTime = 9999999999999;
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
                this.duck.think('bread');
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
            () => new StateIdle(this.duck)
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
}
