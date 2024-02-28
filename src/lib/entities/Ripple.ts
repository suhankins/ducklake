import Entity from './Entity';
import { Mesh, MeshBasicMaterial, Path, Shape, ShapeGeometry } from 'three';
import { lerp } from 'three/src/math/MathUtils';

import type { Object3D, Vector3 } from 'three';
import type Game from '../Game';

export default class Ripple extends Entity {
    model: Object3D;

    startingSize: number;
    currentSize: number;
    maxSize: number;

    timer: number = 0;
    maxTimer: number;

    get progress() {
        return this.timer / this.maxTimer;
    }

    material: MeshBasicMaterial;

    static GEOMETRY = Ripple.getGeometry();

    static getGeometry() {
        const arcShape = new Shape()
            .moveTo(0, 0)
            .absarc(0, 0, 1, 0, Math.PI * 2, false);

        const holePath = new Path()
            .moveTo(0.5, 0.5)
            .absarc(0, 0, 0.85, 0, Math.PI * 2, true);

        arcShape.holes.push(holePath);

        return new ShapeGeometry(arcShape);
    }

    constructor(
        game: Game,
        position: Vector3,
        startingSize: number,
        maxSize: number,
        time: number
    ) {
        super(game);
        this.startingSize = startingSize;
        this.currentSize = startingSize;
        this.maxSize = maxSize;
        this.maxTimer = time;

        this.material = new MeshBasicMaterial({ color: 0xffffff, transparent: true });

        this.model = new Mesh(Ripple.GEOMETRY, this.material);
        this.model.rotateX(-Math.PI / 2);
        this.model.position.copy(position);
        this.model.position.y = 0.01;
        this.updateScale();
        this.updateOpacity();
    }

    updateScale() {
        this.model.scale.set(
            this.currentSize,
            this.currentSize,
            this.currentSize
        );
    }

    updateOpacity() {
        this.material.opacity = 0.8 - this.progress;
        this.material.needsUpdate = true;
    }

    update(dt: number) {
        this.timer += dt;
        if (this.timer > this.maxTimer) {
            this.destroy();
        }
        this.currentSize = lerp(
            this.startingSize,
            this.maxSize,
            this.progress
        );
        this.updateScale();
        this.updateOpacity();
    }
}
