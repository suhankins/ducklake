import State from './State';

import type INextStateFactory from './INextStateFactory';
import type IStateGoesBackToIdle from './IStateEntersNextState';
import type Duck from '../Duck';

export default class StateLaugh extends State implements IStateGoesBackToIdle {
    name = 'laugh';

    nextStateFactory: INextStateFactory;

    /**
     * @constant
     */
    static LAUGH_FOR_SECONDS = 3;

    constructor(duck: Duck, state: INextStateFactory) {
        super(duck);
        this.nextStateFactory = state;
        // TODO: Create a new VFX for laughter. Speech doesn't cut it.
        //this.duck.spawnSpeech(true);
    }

    update() {
        // TODO: Display laugh icon and play sound
        if (this.duck.timeInState > StateLaugh.LAUGH_FOR_SECONDS) {
            this.duck.state = this.nextStateFactory();
        }
    }
}
