import { Object3D, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Base class for all objects in the lake
 */
export abstract class Entity {
    /**
     * Model that is copied by each instance to be added to the scene.
     */
    static MODEL: Object3D;
    abstract model: Object3D;

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
     * Called every tick, updates entity's state
     * @param dt delta time, so time since last tick
     */
    abstract update(dt: number): void;
}

export abstract class PhysicsEntity extends Entity {
    abstract velocity: Vector3;

    abstract TERMINAL_VELOCITY: number;

    /**
     * Adds velocity to the position of the model
     * @param dt delta time
     */
    applyVelocity(dt: number): void {
        this.model.position.addScaledVector(this.velocity, dt);
    }

    capVelocity(): void {
        if (this.velocity.length() > this.TERMINAL_VELOCITY) {
            this.velocity.normalize().multiplyScalar(this.TERMINAL_VELOCITY);
        }
    }
}
