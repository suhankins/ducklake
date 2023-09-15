import { Clock, Euler, Raycaster, Scene, Vector3, WebGLRenderer } from 'three';
import { Entity } from './entities/Entity';
import LoadAssets from './utls/LoadAssets';
import IsometricCamera from './entities/IsometricCamera';
import Lake from './entities/Lake';
import Duck from './entities/Duck/Duck';
import Bread from './entities/Bread';
import WindowToWorld from './utls/WindowToWorld';

export class Game {
    renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    scene: Scene = new Scene();
    /**
     * Used for delta time calculation
     */
    clock: Clock = new Clock();
    /**
     * Camera. Has to be set here due to raycaster using it.
     */
    camera: IsometricCamera = new IsometricCamera();
    /**
     * Lake itself. Should be set here due to raycaster using it.
     */
    lake: Lake = new Lake();
    /**
     * Used for seeing where did the user click in the game world
     */
    raycaster: Raycaster = new Raycaster();
    /**
     * List of all entities that should be updated on the scene.
     */
    entities: { [id: number]: Entity } = {};
    resizeListener: () => void;
    mouseDownListener: (event: MouseEvent) => void;
    contextMenuListener: (event: MouseEvent) => void;

    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.resizeListener = this.getResizeListener();
        this.mouseDownListener = this.getMouseDownListener(this.renderer.domElement);
        this.contextMenuListener = this.getContextMenuListener(this.renderer.domElement);
        document.body.appendChild(this.renderer.domElement);
        this.init();
    }

    async init() {
        await LoadAssets();

        this.addEntity(this.lake);
        this.addEntity(this.camera);

        for (let i = 0; i < 10; i++) {
            this.spawnDuck(
                WindowToWorld(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                )
            );
        }

        this.animate();
    }

    /*
     * GAME LOOP
     */
    animate() {
        requestAnimationFrame(() => this.animate());
    
        let dt = this.clock.getDelta();
    
        // if website is running at very low framerates, it can cause weird things to happen
        // so we cap lowest possible framerate at 10
        // below that it will be slow-mo
        if (dt > 0.1) dt = 0.1;
    
        for (let entityId in this.entities) {
            const entity = this.entities[entityId];
            entity.update(dt);
            if (entity.shouldBeDeleted) {
                entity.model.clear();
                delete this.entities[entityId];
            }
        }
    
        this.renderer.render(this.scene, this.camera.model);
    }

    /*
     * LISTENER MANAGMENT
     */
    getResizeListener() {
        const resizeListener = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight, true);
        };
        addEventListener('resize', resizeListener);
        return resizeListener;
    }

    getMouseDownListener(element: HTMLElement) {
        const mouseDownListener = (event: MouseEvent) => {
            event.preventDefault();
            this.raycaster.setFromCamera(
                {
                    x: (event.clientX / window.innerWidth) * 2 - 1,
                    y: -(event.clientY / window.innerHeight) * 2 + 1,
                },
                this.camera.model
            );
            const intersect = this.raycaster.intersectObject(this.lake.model)[0].point;
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
        }
        element.addEventListener('mousedown', mouseDownListener);
        return mouseDownListener;
    }

    getContextMenuListener(element: HTMLElement) {
        const contextMenuListener = (event: MouseEvent) => {
            event.preventDefault();
        }
        element.addEventListener('contextmenu', contextMenuListener);
        return contextMenuListener;
    }

    /*
     * ENTITY MANAGMENT
     */
    spawnDuck(position?: Vector3) {
        const duck = new Duck(position);
        duck.rotation = new Euler(0, Math.random() * Math.PI * 2, 0);
        this.addEntity(duck);
    }
    
    spawnBread(position: Vector3) {
        position.y = 2 + Math.random(); // So bread falls for a bit
        const bread = new Bread(position);
        this.addEntity(bread);
    }

    /**
     * Adds an entity to the scene and to the list of entities to be updated.
     * @param entity
     */
    addEntity(entity: Entity) {
        this.entities[entity.id] = entity;
        this.scene.add(entity.model);
    }

    /*
     * CLEANUP
     * TODO: Figure out what can even call this
     */
    destroy(): void {
        removeEventListener('resize', this.resizeListener);
        removeEventListener('mousedown', this.mouseDownListener);
        removeEventListener('contextmenu', this.contextMenuListener);
        for (let entityId in this.entities) {
            this.entities[entityId].destroy();
            this.entities[entityId].model.clear();
            delete this.entities[entityId];
        }
    }
}
