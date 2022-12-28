import './style.css';
import { Clock, Raycaster, Scene, WebGLRenderer } from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import Duck from './Entities/Duck';
import LoadAssets from './LoadAssets';
import IsometricCamera from './IsometricCamera';
import Lake from './Lake';
import WindowToWorld from './WindowToWorld';
import { Entity } from './Entities/Entity';
import Bread from './Entities/Bread';
import { DebugDuck } from './Entities/DebugDuck';

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
const entities: Entity[] = [];

/**
 * Adds an entity to the scene and to the list of entities to be updated.
 * @param entity
 */
function addEntity(entity: Entity) {
    entities.push(entity);
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
        const duck = new Duck();
        duck.model.position.copy(
            WindowToWorld(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            )
        );
        duck.model.rotation.set(0, Math.random() * Math.PI * 2, 0);
        addEntity(duck);
    }

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();

    entities.forEach((entity) => {
        entity.update(dt);
    });

    renderer.render(scene, camera);
}

/**
 * Bread spawner
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
    intersect.y = 2 + Math.random(); // So bread falls for a bit

    const bread = new Bread(intersect);
    addEntity(bread);
});

addEventListener('resize', () => {
    camera.updateAspectRatio();
    lake.updateAspectRatio();
    renderer.setSize(window.innerWidth, window.innerHeight, true);
});
