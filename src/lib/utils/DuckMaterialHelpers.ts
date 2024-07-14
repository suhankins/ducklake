import { type Object3D, type Mesh, type MeshBasicMaterial } from 'three';

export function getDuckMaterialByName(
    model: Object3D,
    materialName: string
): MeshBasicMaterial {
    return getDuckObjectWithMaterialByName(model, materialName)
        .material as MeshBasicMaterial;
}

export function getDuckObjectWithMaterialByName(
    model: Object3D,
    materialName: string
): Mesh {
    return model.children[0].children.find(
        (object) =>
            ((object as Mesh).material as MeshBasicMaterial).name ===
            materialName
    ) as Mesh;
}
