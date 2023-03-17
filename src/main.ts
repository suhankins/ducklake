import './style.css';
import { Clock, Euler, Raycaster, Scene, Vector3, WebGLRenderer } from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import Duck from './Entities/Duck';
import LoadAssets from './LoadAssets';
import IsometricCamera from './IsometricCamera';
import Lake from './Lake';
import WindowToWorld from './WindowToWorld';
import { Entity } from './Entities/Entity';
import Bread from './Entities/Bread';

// Checking if WebGL is supported
if (WebGL.isWebGLAvailable()) {
    init();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}

/**
 * Used for delta time calculation
 */
const clock: Clock = new Clock();
/**
 * Used for seeing where did the user click in the game world
 */
const raycaster: Raycaster = new Raycaster();

var renderer: WebGLRenderer;
var scene: Scene;
var camera: IsometricCamera;

/**
 * Lake itself. Should be stored here to be called on window resize.
 */
var lake: Lake;

/**
 * List of all entities that should be updated on the scene.
 */
const entities: { [id: number]: Entity } = {};

/**
 * Adds an entity to the scene and to the list of entities to be updated.
 * @param entity
 */
function addEntity(entity: Entity) {
    entities[entity.id] = entity;
    scene.add(entity.model);
}

async function init() {
    renderer = new WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    await LoadAssets();

    scene = new Scene();
    camera = new IsometricCamera();

    lake = new Lake();
    scene.add(lake.model);

    for (let i = 0; i < 10; i++) {
        spawnDuck(
            WindowToWorld(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            )
        );
    }

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    let dt = clock.getDelta();

    // if website is running at very low framerates, it can cause weird things to happen
    // so we cap lowest possible framerate at 10
    // below that it will be slow-mo
    if (dt > 0.1) dt = 0.1;

    for (let entityId in entities) {
        entities[entityId].update(dt);
        if (entities[entityId].shouldBeDeleted) {
            entities[entityId].model.clear();
            delete entities[entityId];
        }
    }

    renderer.render(scene, camera);
}

function spawnDuck(position?: Vector3) {
    const duck = new Duck(position);
    duck.rotation = new Euler(0, Math.random() * Math.PI * 2, 0);
    addEntity(duck);
}

function spawnBread(position: Vector3) {
    position.y = 2 + Math.random(); // So bread falls for a bit
    const bread = new Bread(position);
    addEntity(bread);
}

/**
 * Bread and duck spawner
 */
addEventListener('mousedown', (event) => {
    raycaster.setFromCamera(
        {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        },
        camera
    );
    const intersect = raycaster.intersectObject(lake.model)[0].point;
    switch (event.button) {
        // Left mouse button
        case 0:
            spawnBread(intersect);
            break;
        // Right mouse button
        case 2:
            spawnDuck(intersect);
            break;
    }
});

addEventListener('resize', () => {
    camera.updateAspectRatio();
    lake.updateAspectRatio();
    renderer.setSize(window.innerWidth, window.innerHeight, true);
});
