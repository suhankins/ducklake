import Bread from '../entities/Bread';
import Breadcrumb from '../entities/Breadcrumb';
import Duck from '../entities/Duck/Duck';

export default async function loadAssets() {
    return await Promise.all([
        Duck.loadModel('./Duck.gltf'),
        Bread.loadModel('./Bread.gltf'),
        Breadcrumb.loadModel('./Breadcrumb.glb')
    ]);
}
