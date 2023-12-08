import WindowToWorld from '../../../utils/WindowToWorld';
import Bread from '../../Bread';
import Duck from '../Duck';
import { State } from './State';
import { StateApproachingTarget } from './StateApproachingTarget';

/**
 * * Duck waits for up to 10 seconds to move randomly on the screen
 */
export class StateIdle extends State {
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
            if (this.duck.hunger < 0 && Bread.breadsExist()) {
                this.setStateToApproachClosestBread();
                return;
            }
            this.setStateToApproachRandomPosition()
        }
    }

    setStateToApproachRandomPosition() {
        this.duck.state = new StateApproachingTarget(
            this.duck,
            WindowToWorld(
                window.innerWidth * Math.random(),
                window.innerHeight * Math.random()
            ),
            StateIdle
        );
    }

    setStateToApproachClosestBread(isEager?: boolean) {
        this.duck.state = new StateApproachingTarget(
            this.duck,
            Bread.getClosestBreadToPosition(this.position),
            StateIdle,
            isEager
        );
    }
}
