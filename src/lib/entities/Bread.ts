import { Object3D, Sphere, Vector3 } from 'three';
import { PhysicsEntity } from './PhysicsEntity';

/**
 * Bread. Intended for ducks to be eaten.
 *
 * Physics are very unrealistic,
 * but I think it looks more fun this way.
 */
export default class Bread extends PhysicsEntity {
    static BREADS: { [id: number]: Bread } = {};
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
        Bread.BREADS[this.id] = this;
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
        const breadKeys = Object.keys(this.BREADS);
        if (breadKeys.length <= this.BREAD_LIMIT) return;
        const oldestBreadIndex = parseInt(breadKeys[0]);
        this.BREADS[oldestBreadIndex].destroy();
    }

    static breadsExist() {
        return Object.keys(this.BREADS).length > 0;
    }

    static getClosestBreadToPosition(position: Vector3) {
        const sortedBreadKeys = Object.keys(Bread.BREADS)
            .map((key) => parseInt(key))
            .toSorted(
                (keyA, keyB) =>
                    Bread.BREADS[keyA].position.distanceTo(position) -
                    Bread.BREADS[keyB].position.distanceTo(position)
            );
        return Bread.BREADS[sortedBreadKeys[0]]
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
        // TODO: Check if we are outside the screen
    }

    destroy() {
        super.destroy();
        delete Bread.BREADS[this.id];
    }
}
