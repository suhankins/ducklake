import { PlaneGeometry, Mesh, Object3D, MeshBasicMaterial } from "three";
import Entity from "./Entity";

export default class Lake extends Entity {
    model: Object3D;

    constructor() {
        super();
        const geometry = new PlaneGeometry(1, 36, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x86A1CC });
        this.model = new Mesh(geometry, material);
        this.model.rotation.x = -Math.PI / 2;
        this.model.rotation.z = Math.PI / 4;
        this.updateAspectRatio();
    }

    updateAspectRatio() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.model.scale.setX(aspectRatio * 36);
    }

    update() {}
}