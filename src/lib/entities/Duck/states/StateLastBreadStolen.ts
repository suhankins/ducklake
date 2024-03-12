import State from './State';
import StateLaugh from './StateLaugh';
import StateRamming from './StateRamming';
import Bread from '../../Bread';
import StateApproachingBread from './StateApproachingBread';

import type INextStateFactory from './INextStateFactory';
import type Duck from '../Duck';
import type IStateGoesBackToIdle from './IStateEntersNextState';

/**
 * State duck should enter when it is very hungry
 * and last bread was eaten by another duck
 */
export default class StateLastBreadStolen
    extends State
    implements IStateGoesBackToIdle
{
    name = 'last bread stolen';

    deceleration = 0.4;
    rotationSpeed = 0.6;

    nextStateFactory: INextStateFactory;
    breadEatenBy: Duck;

    /**
     * @constant
     */
    static DISPLAY_ICON_FOR_SECONDS = 5;

    constructor(
        duck: Duck,
        nextStateFactory: INextStateFactory,
        breadEatenBy: Duck
    ) {
        super(duck);
        this.nextStateFactory = nextStateFactory;
        this.breadEatenBy = breadEatenBy;
        this.duck.target = this.breadEatenBy;
    }

    update(dt: number) {
        // TODO: Display an angry bubble
        if (Bread.breadsExist) {
            this.duck.spawnSpeech();
            this.duck.state = new StateApproachingBread(
                this.duck,
                Bread.getClosestBreadToPosition(this.position),
                this.nextStateFactory,
                true
            );
            return;
        }
        this.duck.rotateTowardsTarget(dt);
        if (
            this.duck.timeInState <
            StateLastBreadStolen.DISPLAY_ICON_FOR_SECONDS
        ) {
            return;
        }

        if (
            StateRamming.willTheTargetBeReached(
                this.position,
                this.breadEatenBy.position
            )
        ) {
            this.duck.state = new StateRamming(
                this.duck,
                this.breadEatenBy,
                () => new StateLaugh(this.duck, this.nextStateFactory)
            );
        } else {
            this.duck.state = this.nextStateFactory();
        }
    }
}
