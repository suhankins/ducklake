import { Object3D, Sphere, Vector3 } from 'three';
import { PhysicsEntity } from './PhysicsEntity';
import isPositionOutsideScreen from '../utils/isPositionOutsideScreen';

/**
 * Bread. Intended for ducks to be eaten.
 *
 * Physics are very unrealistic,
 * but I think it looks more fun this way.
 */
export default class Bread extends PhysicsEntity {
    static breadCount: number = 0;
    static breads: { [id: number]: Bread } = {};
    static BREAD_LIMIT = 24;

    name: string = 'bread';

    collision: Sphere;
    mass = 1;

    velocity: Vector3 = new Vector3();
    terminalVelocity: number = 10;
    deceleration: number = 2;

    model: Object3D;

    constructor(position?: Vector3) {
        super();
        Bread.breads[this.id] = this;
        Bread.breadCount++;
        this.model = Bread.MODEL.clone(true);
        this.position = position ?? new Vector3();
        this.model.rotation.y = Math.random() * Math.PI * 2 - Math.PI;
        this.collision = new Sphere(this.model.position, 0.7);
        Bread.CHECK_BREADS();
    }

    /**
     * Checks if we have too many breads on the scene.
     * If so, destroys the oldest one.
     */
    static CHECK_BREADS() {
        if (Bread.breadCount <= Bread.BREAD_LIMIT) return;
        const breadKeys = Object.keys(this.breads);
        const oldestBreadIndex = parseInt(breadKeys[0]);
        this.breads[oldestBreadIndex].destroy();
    }

    static breadsExist() {
        return Bread.breadCount > 0;
    }

    static getClosestBreadToPosition(position: Vector3) {
        const sortedBreadKeys = Object.entries(Bread.breads).toSorted(
            ([_keyA, valueA], [_keyB, valueB]) =>
                valueA.position.distanceTo(position) -
                valueB.position.distanceTo(position)
        );
        return sortedBreadKeys[0][1];
    }

    beEaten() {
        // TODO: Play sound and make some particles appear
        this.destroy();
    }

    update(dt: number): void {
        this.updateGravity(dt);
        // Capping velocity
        this.capVelocity();
        this.checkCollisions();
        this.pushAway(dt);
        this.decelerate(dt);
        // Adding velocity to our position, so moving the bread
        this.applyVelocity(dt);
        this.checkIfOutsideTheScreen();
    }

    checkIfOutsideTheScreen() {
        if (isPositionOutsideScreen(this.position)) {
            this.destroy();
        }
    }

    destroy() {
        super.destroy();
        Bread.breadCount--;
        delete Bread.breads[this.id];
    }
}
