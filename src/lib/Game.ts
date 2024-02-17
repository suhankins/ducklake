import {
    Clock,
    Raycaster,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three';
import loadAssets from './utils/loadAssets';
import IsometricCamera from './entities/IsometricCamera';
import Lake from './entities/Lake';
import Duck from './entities/Duck/Duck';
import Bread from './entities/Bread';
import getRandomPosition from './utils/getRandomPosition';

import type Entity from './entities/Entity';
import { CSS2DRenderer } from 'three/examples/jsm/Addons';

export default class Game {
    static HIGHEST_ALLOWED_DELTA: number = 1 / 20;

    private webglRenderer = new WebGLRenderer({
        antialias: true,
    });
    private css2dRenderer = new CSS2DRenderer();
    private scene: Scene = new Scene();
    /**
     * Used for delta time calculation
     */
    private clock: Clock = new Clock();
    /**
     * Camera. Has to be set here due to raycaster using it.
     */
    private camera: IsometricCamera = new IsometricCamera(this);
    /**
     * Lake itself. Should be set here due to raycaster using it.
     */
    private lake: Lake = new Lake(this);
    /**
     * Used for seeing where did the user click in the game world
     */
    private raycaster: Raycaster = new Raycaster();
    /**
     * List of all entities that should be updated on the scene.
     */
    private entities: { [id: number]: Entity } = {};
    private resizeListener: () => void;
    private mouseDownListener: (event: MouseEvent) => void;
    private contextMenuListener: (event: MouseEvent) => void;

    /*
     * INITIALIZATION
     */
    constructor() {
        this.webglRenderer.setSize(window.innerWidth, window.innerHeight);

        this.css2dRenderer.setSize(window.innerWidth, window.innerHeight);
        this.css2dRenderer.domElement.className = 'css2drenderer';

        document.body.appendChild(this.webglRenderer.domElement);
        document.body.appendChild(this.css2dRenderer.domElement);

        this.mouseDownListener = this.getMouseDownListener(
            this.webglRenderer.domElement
        );
        this.contextMenuListener = this.getContextMenuListener(
            this.webglRenderer.domElement
        );
        this.resizeListener = this.getResizeListener();

        this.init();
    }

    private async init() {
        await loadAssets();

        this.addEntity(this.lake);
        this.addEntity(this.camera);

        for (let i = 0; i < 10; i++) {
            this.spawnDuck(getRandomPosition());
        }

        this.animate();
    }

    /*
     * GAME LOOP
     */
    private animate() {
        requestAnimationFrame(() => this.animate());

        let dt = this.clock.getDelta();

        // If website is running at very low framerates, it can cause weird things to happen,
        // so we cap lowest possible framerate. Below this threshold it will be slow-mo
        if (dt > Game.HIGHEST_ALLOWED_DELTA) dt = Game.HIGHEST_ALLOWED_DELTA;

        for (let entityId in this.entities) {
            const entity = this.entities[entityId];
            entity.update(dt);
            if (entity.shouldBeDeleted) {
                this.scene.remove(entity.model);
                entity.model.clear();
                delete this.entities[entityId];
            }
        }

        this.webglRenderer.render(this.scene, this.camera.model);
        this.css2dRenderer.render(this.scene, this.camera.model);
    }

    /*
     * LISTENER MANAGMENT
     */
    private getResizeListener() {
        const resizeListener = () => {
            this.webglRenderer.setSize(
                window.innerWidth,
                window.innerHeight,
                true
            );
            this.css2dRenderer.setSize(window.innerWidth, window.innerHeight);
        };
        addEventListener('resize', resizeListener);
        return resizeListener;
    }

    private getMouseDownListener(element: HTMLElement) {
        const mouseDownListener = (event: MouseEvent) => {
            event.preventDefault();
            this.raycaster.setFromCamera(
                new Vector2(
                    (event.clientX / window.innerWidth) * 2 - 1,
                    -(event.clientY / window.innerHeight) * 2 + 1
                ),
                this.camera.model
            );
            const intersect = this.raycaster.intersectObject(this.lake.model)[0]
                .point;
            switch (event.button) {
                // Left mouse button
                case 0:
                    this.spawnBread(intersect);
                    break;
                // Right mouse button
                case 2:
                    this.spawnDuck(intersect);
                    break;
            }
        };
        element.addEventListener('mousedown', mouseDownListener);
        return mouseDownListener;
    }

    private getContextMenuListener(element: HTMLElement) {
        const contextMenuListener = (event: MouseEvent) => {
            event.preventDefault();
        };
        element.addEventListener('contextmenu', contextMenuListener);
        return contextMenuListener;
    }

    /*
     * ENTITY MANAGMENT
     */
    spawnDuck(position?: Vector3) {
        this.addEntity(new Duck(this, position));
    }

    spawnBread(position: Vector3) {
        this.addEntity(new Bread(this, position.setY(2 + Math.random()))); // So bread falls for a bit
    }

    /**
     * Adds an entity to the scene and to the list of entities to be updated.
     * @param entity
     */
    addEntity<T extends Entity>(entity: T) {
        this.entities[entity.id] = entity;
        this.scene.add(entity.model);
        return entity;
    }

    /*
     * CLEANUP
     */
    /**
     * @todo Figure out what can even call this
     */
    destroy(): void {
        removeEventListener('resize', this.resizeListener);
        removeEventListener('mousedown', this.mouseDownListener);
        removeEventListener('contextmenu', this.contextMenuListener);
        for (let entityId in this.entities) {
            this.entities[entityId].destroy();
            this.scene.remove(this.entities[entityId].model);
            this.entities[entityId].model.clear();
            delete this.entities[entityId];
        }
    }
}
