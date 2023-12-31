import Bread from '../entities/Bread';
import Duck from '../entities/Duck/Duck';

export default function LoadAssets() {
    return Promise.all([
        Duck.loadModel('./Duck.gltf'),
        Bread.loadModel('./Bread.gltf'),
    ]);
}
