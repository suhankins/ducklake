import WindowToWorld from '../../WindowToWorld';
import Duck from './Duck';
import { StateApproachingTarget } from './states/StateApproachingTarget';
import { StateIdle } from './states/StateIdle';

export class DebugDuck extends Duck {
    constructor() {
        super();
        this.state = new StateIdle(this, true);
        
        addEventListener('mousedown', (event) => {
            if (event.button == 0) {
                this.model.rotation.y = this.angleTowards(
                    WindowToWorld(event.clientX, event.clientY)
                );
            }
            if (event.button == 2) {
                this.state = new StateApproachingTarget(
                    this,
                    WindowToWorld(event.clientX, event.clientY),
                    StateIdle
                );
            }
        });

        addEventListener('mousemove', (event) => {
            const desiredPosition = WindowToWorld(event.clientX, event.clientY);
            const currentAngle =
                Math.abs(this.model.rotation.y) % (Math.PI * 2);
            const desiredAngle = this.angleTowards(desiredPosition);

            console.log(
                (currentAngle < desiredAngle ? 1 : -1) *
                    (Math.abs(currentAngle - desiredAngle) > Math.PI ? -1 : 1),
                currentAngle,
                desiredAngle
            );
        });
    }
}
