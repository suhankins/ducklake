import { Object3D, Vector3 } from 'three';
import Entity from './Entity';

export default class Bread extends Entity {
    model: Object3D;

    private static GRAVITY: number = -2;
    private static WATER_PRESSURE: number = 2;

    private static TERMINAL_VELOCITY: number = 2;

    private gravityDisabled: boolean = false;

    private velocity: Vector3 = new Vector3(0, 0, 0);

    constructor(position: Vector3) {
        super();
        this.model = Bread.MODEL.clone(true);
        this.model.position.copy(position);
        this.model.rotation.y = Math.random() * Math.PI - Math.PI;
    }

    update(dt: number): void {
        if (!this.gravityDisabled) this.updateGravity(dt);
    }

    updateGravity(dt: number) {
        // If bread pretty much stopped moving, we stop updating gravity
        if (this.model.position.y > 0 && this.model.position.y < 0.05 && Math.abs(this.velocity.y) < 0.03) {
            this.gravityDisabled = true;
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

        // Stopping bread from moving too fast
        if (this.velocity.length() > Bread.TERMINAL_VELOCITY) {
            this.velocity.normalize().multiplyScalar(Bread.TERMINAL_VELOCITY);
        }
        
        // Adding velocity to our position, so moving the bread
        this.model.position.add(this.velocity);

        // Bread entered water
        if (this.model.position.y < 0 && direction == 'down') {
            // TODO: Add riples
            this.velocity.y /= 2;
        }
    }
}