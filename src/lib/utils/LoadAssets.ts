import Bread from '../entities/Bread';
import Duck from '../entities/Duck/Duck';

export default function LoadAssets(): Promise<void> {
    return new Promise<void>(async (resolve) => {
        await Duck.loadModel('./Duck.gltf');
        await Bread.loadModel('./Bread.gltf');
        resolve();
    });
}
