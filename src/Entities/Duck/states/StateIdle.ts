import WindowToWorld from "../../../WindowToWorld";
import Duck from "../Duck";
import { State } from "./State";
import { StateApproachingTarget } from "./StateApproachingTarget";

/**
 * * Duck waits for up to 10 seconds to move randomly on the screen
 * * Duck decelerates
 */
export class StateIdle extends State {
    name: string = 'idle';

    randomMovementTime: number = Math.random() * 10;

    static DECELERATION = 2;

    constructor(duck: Duck, dontMove: boolean = false) {
        super(duck);
        if (dontMove) this.randomMovementTime = 9999999999999;
    }

    update(dt: number): void {
        this.duck.decelerate(dt);

        if (this.duck.timeInState > this.randomMovementTime) {
            this.duck.state = new StateApproachingTarget(
                this.duck,
                WindowToWorld(
                    window.innerWidth * Math.random(),
                    window.innerHeight * Math.random()
                ),
                StateIdle
            );
        }
    }
}
