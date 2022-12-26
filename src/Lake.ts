import { PlaneGeometry, Mesh, Object3D, MeshBasicMaterial } from 'three';

/**
 * Lake itself.
 * Fills the whole screen.
 */
export default class Lake {
    model: Object3D;

    constructor() {
        const geometry = new PlaneGeometry(1, 36, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x86a1cc });
        this.model = new Mesh(geometry, material);
        this.model.rotation.x = -Math.PI / 2;
        this.model.rotation.z = Math.PI / 4;
        this.updateAspectRatio();
    }

    /**
     * Makes the lake fill the whole screen.
     *
     * Should be called every time window is resized.
     */
    updateAspectRatio() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.model.scale.setX(aspectRatio * 36);
    }
}
