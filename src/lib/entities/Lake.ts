import { PlaneGeometry, Mesh, Object3D, MeshBasicMaterial } from 'three';
import Entity from './Entity';

import type Game from '../Game';

/**
 * Lake itself.
 * Fills the whole screen.
 */
export default class Lake extends Entity {
    name = 'lake';
    
    model: Object3D;
    resizeListener: () => void;

    /**
     * @constant
     */
    static GEOMETRY = new PlaneGeometry(1, 36, 1, 1);
    /**
     * @constant
     */
    static MATERIAL = new MeshBasicMaterial({ color: 0x86a1cc });

    constructor(game: Game) {
        super(game);
        this.model = new Mesh(Lake.GEOMETRY, Lake.MATERIAL);
        this.model.rotation.x = -Math.PI / 2;
        this.model.rotation.z = Math.PI / 4;
        this.resizeListener = this.getResizeListener();
        this.updateAspectRatio();
    }

    getResizeListener() {
        const resizeListener = () => {
            this.updateAspectRatio();
        };
        addEventListener('resize', resizeListener);
        return resizeListener;
    }

    update(_dt: number): void {}

    /**
     * Makes the lake fill the whole screen.
     */
    updateAspectRatio() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.model.scale.setX(aspectRatio * 36);
    }

    destroy(): void {
        super.destroy();
        removeEventListener('resize', this.resizeListener);
    }
}
