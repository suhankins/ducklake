import State from './State';

import type INextStateFactory from './INextStateFactory';
import type IStateGoesBackToIdle from './IStateEntersNextState';
import type Duck from '../Duck';

export default class StateLaugh extends State implements IStateGoesBackToIdle {
    name = "laugh";

    deceleration = 0.4;

    nextStateFactory: INextStateFactory;

    /**
     * @constant
     */
    static LAUGH_FOR_SECONDS = 3;

    constructor(duck: Duck, state: INextStateFactory) {
        super(duck);
        this.nextStateFactory = state;
    }

    update() {
        // TODO: Display laugh icon and play sound
        if (this.duck.timeInState > StateLaugh.LAUGH_FOR_SECONDS) {
            this.duck.state = this.nextStateFactory();
        }
    }
}
