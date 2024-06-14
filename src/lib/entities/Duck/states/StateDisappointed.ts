import State from './State';
import Drop from '../../VFX/Drop/Drop';

import type INextStateFactory from './INextStateFactory';
import type IStateGoesBackToIdle from './IStateEntersNextState';
import type Duck from '../Duck';

export default class StateDisappointed
    extends State
    implements IStateGoesBackToIdle
{
    name = 'disappointed';

    nextStateFactory: INextStateFactory;

    /**
     * @constant
     */
    static STAY_IN_STATE = 2;

    constructor(duck: Duck, state: INextStateFactory) {
        super(duck);
        this.nextStateFactory = state;

        this.duck.emote(
            new Drop(this.game, this.duck, StateDisappointed.STAY_IN_STATE)
        );
    }

    update() {
        if (this.duck.timeInState > StateDisappointed.STAY_IN_STATE) {
            this.duck.state = this.nextStateFactory();
        }
    }
}
