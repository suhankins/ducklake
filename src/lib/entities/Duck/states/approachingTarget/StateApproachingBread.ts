import Bread from '../../../Bread';
import { StateApproachingTarget } from './StateApproachingTarget';

/**
 * Duck moves towards target bread
 * 
 * Duck enters next state when:
 * * Beak has touched the bread
 * * Bread is gone
 * * Duck is very hungry and duck isn't eager to reach given target
 */
export default class StateApproachingBread extends StateApproachingTarget {
    name: string = 'approaching target: bread';

    update(dt: number) {
        if (this.isEager) this.updateTarget();
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
        this.duck.hunger = 30 * Math.random();
    }
}
