import { StateApproachingTarget } from './StateApproachingTarget';

export default class StateApproachingBread extends StateApproachingTarget {
    name: string = 'approaching target: bread';

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
