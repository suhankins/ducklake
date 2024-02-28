import { Object3D, Sphere, Vector3 } from 'three';
import PhysicsEntity from './PhysicsEntity';
import isPositionOutsideScreen from '../utils/isPositionOutsideScreen';
import Duck from './Duck/Duck';

import type ITarget from './ITarget';
import type Game from '../Game';
import type Entity from './Entity';
import Pop from './Pop/Pop';
import Ripple from './Ripple';

/**
 * Bread. Intended for ducks to be eaten.
 *
 * Physics are very unrealistic,
 * but I think it looks more fun this way.
 */
export default class Bread extends PhysicsEntity implements ITarget {
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

    /**
     * Set when bread is eaten, so other ducks have a chance
     * to find out who stole their bread.
     */
    eatenBy: Duck | null = null;

    constructor(game: Game, position?: Vector3) {
        super(game);
        Bread.breads[this.id] = this;
        Bread.breadCount++;
        this.model = Bread.MODEL.clone(true);
        this.position = position ?? new Vector3();
        this.model.rotation.y = Math.random() * Math.PI * 2 - Math.PI;
        this.collision = new Sphere(this.model.position, 0.7);
        Bread.checkBreadLimit();
        this.spawnPop();
    }

    /**
     * Checks if we have too many breads on the scene.
     * If so, destroys the oldest one.
     */
    static checkBreadLimit() {
        if (Bread.breadCount <= Bread.BREAD_LIMIT) return;
        const breadKeys = Object.keys(Bread.breads);
        const oldestBreadIndex = parseInt(breadKeys[0]);
        Bread.breads[oldestBreadIndex].spawnPop();
        Bread.breads[oldestBreadIndex].spawnRipple();
        Bread.breads[oldestBreadIndex].destroy();
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

    onReached(reachedBy: Entity) {
        if (reachedBy instanceof Duck) {
            // TODO: Play sound and make some particles appear
            this.eatenBy = reachedBy;
            this.destroy();
        }
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

    enteredWater(strength: number) {
        if (strength < 4) return;
        this.spawnRipple(strength * 0.06);
    }

    checkIfOutsideTheScreen() {
        if (isPositionOutsideScreen(this.position)) {
            this.destroy();
        }
    }

    /**
     * Spawns Pop entity on Bread's location
     */
    spawnPop() {
        this.game.addEntity(new Pop(this.game, this.position));
    }

    /**
     * Spawns Ripple entity on Bread's location
     * @param expandsBy by how many units should ripple expand. 0.6 by default.
     */
    spawnRipple(expandsBy: number = 0.6) {
        this.game.addEntity(
            new Ripple(
                this.game,
                new Vector3().copy(this.position).setY(0.01),
                0.4,
                0.4 + expandsBy,
                1.2
            )
        );
    }

    destroy() {
        super.destroy();
        Bread.breadCount--;
        delete Bread.breads[this.id];
    }
}
