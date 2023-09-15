import { PlaneGeometry, Mesh, Object3D, MeshBasicMaterial } from 'three';
import { Entity } from './Entity';

/**
 * Lake itself.
 * Fills the whole screen.
 */
export default class Lake extends Entity {
    model: Object3D;
    resizeListener: () => void;

    constructor() {
        super();
        const geometry = new PlaneGeometry(1, 36, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x86a1cc });
        this.model = new Mesh(geometry, material);
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
