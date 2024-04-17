import Bread from '../entities/Bread';
import Breadcrumb from '../entities/Breadcrumb';
import Duck from '../entities/Duck/Duck';

export default async function loadAssets() {
    return await Promise.all([
        Duck.loadModel('/model/Duck.gltf'),
        Bread.loadModel('/model/Bread.gltf'),
        Breadcrumb.loadModel('/model/Breadcrumb.glb'),
    ]);
}
