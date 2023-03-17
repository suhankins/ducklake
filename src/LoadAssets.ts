import Bread from './Entities/Bread';
import Duck from './Entities/Duck/Duck';

export default function LoadAssets(): Promise<void> {
    return new Promise<void>(async (resolve) => {
        await Duck.loadModel('./Duck.gltf');
        await Bread.loadModel('./Bread.gltf');
        resolve();
    });
}
