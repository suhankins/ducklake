import { Euler, Object3D, Sphere, Vector3 } from 'three';
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

    static CHECK_BREADS() {
        const breadKeys = Object.keys(this.BREADS);
        console.log(breadKeys.length);
        if (breadKeys.length <= this.BREAD_LIMIT) return;
        const oldestBreadIndex = parseInt(breadKeys.sort()[0]);
        this.BREADS[oldestBreadIndex].destroy();
    }

    name: string = 'bread';

    collision: Sphere;

    velocity: Vector3 = new Vector3();
    angularVelocity: Euler = new Euler();

    terminalVelocity: number = 10;
    angularTerminalVelocity: number = 2;

    deceleration: number = 2;

    model: Object3D;

    /**
     * Falling acceleration
     */
    private static readonly GRAVITY: number = -30;
    /**
     * Acceleration that pushes bread out of water
     */
    private static readonly WATER_PRESSURE: number = 40;

    constructor(position?: Vector3) {
        super();
        Bread.BREADS[this.id] = this;
        this.model = Bread.MODEL.clone(true);
        this.position = position ?? new Vector3();
        this.model.rotation.y = Math.random() * Math.PI * 2 - Math.PI;
        this.collision = new Sphere(this.model.position, 0.7);
        Bread.CHECK_BREADS();
    }

    update(dt: number): void {
        this.updateGravity(dt);
        // Capping velocity
        this.capVelocity();
        this.decelerate(dt);
        // Adding velocity to our position, so moving the bread
        this.applyVelocity(dt);
    }

    updateGravity(dt: number) {
        // If bread pretty much stopped moving, we stop updating gravity
        if (
            this.model.position.y > 0 &&
            this.model.position.y < 0.05 &&
            Math.abs(this.velocity.y) < 0.03
        ) {
            return;
        }

        // Adding vertical velocity to our bread piece
        var direction: 'up' | 'down';
        if (this.model.position.y > 0) {
            direction = 'down';
            this.velocity.add(new Vector3(0, Bread.GRAVITY * dt, 0));
        } else {
            direction = 'up';
            this.velocity.add(new Vector3(0, Bread.WATER_PRESSURE * dt, 0));
        }

        // Bread will enter water this frame
        if (
            direction == 'down' &&
            this.velocity.y * dt * -1 > this.model.position.y
        ) {
            // TODO: Add riples
            this.velocity.y /= 2;
        }
    }

    destroy() {
        super.destroy();
        delete Bread.BREADS[this.id];
    }
}
