import { Euler, Object3D, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Base class for all objects in the lake
 */
export abstract class Entity {
    id: number;
    private static IdIndex = 0;
    /**
     * Model that is copied by each instance to be added to the scene.
     */
    static MODEL: Object3D;
    abstract model: Object3D;
    public get position() {
        return this.model.position;
    }
    public set position(v: Vector3) {
        this.model.position.copy(v);
    }
    public get rotation() {
        return this.model.rotation;
    }
    public set rotation(r: Euler) {
        this.model.rotation.copy(r);
    }
    /**
     * Gets set in destroy. Indicates to list of entities that this entity needs to be gone
     */
    shouldBeDeleted: boolean = false;

    /**
     * Loads model into this.MODEL of the class.
     * @param modelUrl url to the model
     * @returns {Promise} Promise, that is resolved once model is loaded
     */
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
                    alert(
                        `Error while loading model for ${this.name}: ${event.message}`
                    );
                } // On error
            );
        });
    }

    /**
     * Creates a new entity, moving ID index forward
     */
    constructor() {
        this.id = Entity.IdIndex++;
    }

    /**
     * Called every tick, updates entity's state
     * @param dt delta time, so time since last tick
     */
    abstract update(dt: number): void;

    /**
     * Should be called before object is removed from the list.
     */
    destroy(): void {
        this.shouldBeDeleted = true;
    }
}
