import Bread from '../../Bread';
import State from './State';
import StateApproachingTarget from './approachingTarget/StateApproachingTarget';
import getRandomPosition from '../../../utils/getRandomPosition';
import RoamingTarget from '../../RoamingTarget';
import StateApproachingBread from './approachingTarget/StateApproachingBread';

import type Duck from '../Duck';

/**
 * * Duck waits for up to 10 seconds to move randomly on the screen
 */
export default class StateIdle extends State {
    name: string = 'idle';

    randomMovementTime: number = Math.random() * 10;

    static DECELERATION = 2;

    constructor(duck: Duck, dontMove: boolean = false) {
        super(duck);
        if (dontMove) this.randomMovementTime = 9999999999999;
    }

    update(): void {
        if (this.veryHungryCheck()) {
            this.setStateToApproachClosestBread(true);
            return;
        }

        if (this.duck.timeInState > this.randomMovementTime) {
            if (
                this.duck.isHungry() &&
                Bread.breadsExist()
            ) {
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
                new RoamingTarget(
                    this.game,
                    this.duck,
                    getRandomPosition()
                )
            ),
            StateIdle
        );
    }

    setStateToApproachClosestBread(isEager?: boolean) {
        this.duck.state = new StateApproachingBread(
            this.duck,
            Bread.getClosestBreadToPosition(this.position),
            StateIdle,
            isEager
        );
    }
}
