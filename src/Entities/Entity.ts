import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default abstract class Entity {
    static MODEL: Object3D;
    abstract model: Object3D;

    static async loadModel(modelUrl: string): Promise<void> {
        const loader = new GLTFLoader();
        return new Promise<void>((resolve) => {
            loader.load(
                modelUrl, // Path
                (gltf) => { 
                    this.MODEL = gltf.scene;
                    resolve();
                }, // On success
                undefined, // On progress
                (event) => { 
                    alert(`Error while loading model for ${this.name}: ${event.message}`);
                } // On error
            )
        })
    }

    abstract update(dt: number): void;
}
