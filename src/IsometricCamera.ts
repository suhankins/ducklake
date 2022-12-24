import { OrthographicCamera } from 'three';

export default class IsometricCamera extends OrthographicCamera {
    static D: number = 10;

    private static getHorizontal() {
        return (IsometricCamera.D * window.innerWidth) / window.innerHeight;
    }

    constructor() {
        super(
            -IsometricCamera.getHorizontal(),
            IsometricCamera.getHorizontal(),
            IsometricCamera.D,
            -IsometricCamera.D,
            1,
            1000
        );

        this.position.set(
            IsometricCamera.D,
            IsometricCamera.D,
            IsometricCamera.D
        );
        this.lookAt(0, 0, 0);
    }

    updateAspectRatio() {
        this.left = -IsometricCamera.getHorizontal();
        this.right = IsometricCamera.getHorizontal();

        this.updateProjectionMatrix();
    }
}
