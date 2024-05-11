import State from './State';
import StateLaugh from './StateLaugh';
import StateRamming from './StateRamming';
import Bread from '../../Bread';
import StateApproachingBread from './StateApproachingBread';
import Thought from '../../VFX/Thought/Thought';
import Anger from '../../VFX/Anger/Anger';

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

    thought: Thought | null = null;

    /**
     * @constant
     */
    static DISPLAY_ICON_FOR_SECONDS = 8;
    /**
     * @constant
     */
    static DISPLAY_THOUGHT_AFTER = 2;

    constructor(
        duck: Duck,
        nextStateFactory: INextStateFactory,
        breadEatenBy: Duck
    ) {
        super(duck);
        this.nextStateFactory = nextStateFactory;
        this.breadEatenBy = breadEatenBy;
        this.duck.target = this.breadEatenBy;

        this.duck.emote(
            new Anger(
                this.game,
                this.duck,
                StateLastBreadStolen.DISPLAY_ICON_FOR_SECONDS
            )
        );
    }

    update(dt: number) {
        if (Bread.breadsExist) {
            this.duck.quack();
            this.duck.state = new StateApproachingBread(
                this.duck,
                Bread.getClosestBreadToPosition(this.position),
                this.nextStateFactory,
                true
            );
            this.duck.currentEmote?.destroy();
            this.thought?.destroy();
            return;
        }
        this.duck.rotateTowardsTarget(dt);

        if (
            !this.thought &&
            this.duck.timeInState > StateLastBreadStolen.DISPLAY_THOUGHT_AFTER
        ) {
            this.duck.emote(
                new Thought(
                    this.game,
                    'duckWithBread',
                    this.duck,
                    StateLastBreadStolen.DISPLAY_ICON_FOR_SECONDS -
                        this.duck.timeInState
                )
            );
        }

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
            // TODO: Disappointed state
            this.duck.state = this.nextStateFactory();
        }
    }

    onThoughtDestoyed(prematurely: boolean): void {
        if (!prematurely) {
            return;
        }
        // TODO: Surprised state
        this.duck.state = this.nextStateFactory();
    }
}
