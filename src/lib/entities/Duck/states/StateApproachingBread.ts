import Bread from '../../Bread';
import StateApproachingTarget from './StateApproachingTarget';
import StateLastBreadStolen from './StateLastBreadStolen';

/**
 * Duck moves towards target bread
 *
 * Duck enters next state when:
 * * Beak has touched the bread
 * * Bread is gone
 * * Duck is very hungry and duck isn't eager to reach given target
 */
export default class StateApproachingBread extends StateApproachingTarget {
    name = 'approaching bread';

    update(dt: number) {
        if (this.isEager) {
            if (Bread.breadsExist) {
                this.updateTarget();
            } else if (this.target instanceof Bread && this.target.eatenBy) {
                this.duck.state = new StateLastBreadStolen(
                    this.duck,
                    this.nextStateFactory,
                    this.target.eatenBy
                );
                return;
            }
        }
        super.update(dt);
    }

    updateTarget() {
        this.target = Bread.getClosestBreadToPosition(this.position);
    }

    /**
     * @override
     */
    checkForTargetCollision() {
        this.duck.updateBeak();
        const touchedBread = this.duck.beakCollisionList.at(0);
        if (touchedBread) this.target = touchedBread;
        return !!touchedBread;
    }

    /**
     * @override
     */
    onTargetReached() {
        this.duck.hunger = 30 * Math.random() + 30;
    }
}
