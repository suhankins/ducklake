import State from './State';
import Laughter from '../../VFX/Laughter/Laughter';

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

        this.duck.emote(
            new Laughter(this.game, this.duck, StateLaugh.LAUGH_FOR_SECONDS)
        );
    }

    update() {
        if (this.duck.timeInState > StateLaugh.LAUGH_FOR_SECONDS) {
            this.duck.state = this.nextStateFactory();
        }
    }
}
