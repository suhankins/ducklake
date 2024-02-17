import Bread from '../entities/Bread';
import Duck from '../entities/Duck/Duck';

export default async function LoadAssets() {
    return await Promise.all([
        Duck.loadModel('./Duck.gltf'),
        Bread.loadModel('./Bread.gltf'),
    ]);
}
