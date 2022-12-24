import './style.css';
import { Clock, Raycaster, Scene, WebGLRenderer } from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import Duck from './Entities/Duck';
import LoadAssets from './LoadAssets';
import IsometricCamera from './IsometricCamera';
import Lake from './Entities/Lake';
import WindowToWorld from './WindowToWorld';
import Entity from './Entities/Entity';
import Bread from './Entities/Bread';

// Checking if WebGL is supported
if (WebGL.isWebGLAvailable()) {
    init();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.body.appendChild(warning);
}

const clock: Clock = new Clock();
const raycaster: Raycaster = new Raycaster();

var renderer: WebGLRenderer;
var scene: Scene;
var camera: IsometricCamera;

var lake: Lake;

var debugDuck: Duck;

const entities: Entity[] = [];

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
    //scene.add(new AmbientLight(0xffffff, 1.0));

    lake = new Lake();
    scene.add(lake.model);

    for (let i = 0; i < 1; i++) {
        const duck = new Duck();
        debugDuck = duck;
        duck.model.position.copy(WindowToWorld(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight
        ));
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

addEventListener('mousedown', (event) => {
    raycaster.setFromCamera({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
    }, camera);

    const intersect = raycaster.intersectObject(lake.model)[0].point;
    intersect.y = 2; // So bread falls for a bit

    debugDuck.lookAt(intersect);

    const bread = new Bread(intersect);
    addEntity(bread);
});

addEventListener('resize', () => {
    camera.updateAspectRatio();
    lake.updateAspectRatio();
    renderer.setSize(window.innerWidth, window.innerHeight, true);
});