import { OrthographicCamera } from 'three';
import { Entity } from './Entity';
import type Game from '../Game';

export default class IsometricCamera extends Entity {
    static D: number = 10;
    model: OrthographicCamera;
    resizeListener: () => void;

    private static getHorizontal() {
        return (IsometricCamera.D * window.innerWidth) / window.innerHeight;
    }

    constructor(game: Game) {
        super(game);
        this.model = new OrthographicCamera(
            -IsometricCamera.getHorizontal(),
            IsometricCamera.getHorizontal(),
            IsometricCamera.D,
            -IsometricCamera.D,
            1,
            1000
        );

        this.model.position.set(
            IsometricCamera.D,
            IsometricCamera.D,
            IsometricCamera.D
        );
        this.model.lookAt(0, 0, 0);
        this.resizeListener = this.getResizeListener();
    }

    getResizeListener() {
        const resizeListener = () => {
            this.updateAspectRatio();
        };
        addEventListener('resize', resizeListener);
        return resizeListener;
    }

    updateAspectRatio() {
        this.model.left = -IsometricCamera.getHorizontal();
        this.model.right = IsometricCamera.getHorizontal();

        this.model.updateProjectionMatrix();
    }

    update(_dt: number): void {}

    destroy(): void {
        super.destroy();
        removeEventListener('resize', this.resizeListener);
    }
}
