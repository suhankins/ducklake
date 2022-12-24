import WindowToWorld from '../WindowToWorld';
import Duck from './Duck';

export abstract class State {
    abstract name: string;

    duck: Duck;

    constructor(duck: Duck) {
        this.duck = duck;
        this.onEnter();
    }

    abstract onEnter(): void;

    abstract update(dt: number): void;
}

export class StateIdle extends State {
    name: string = 'idle';
    
    randomMovementTime: number = Math.random() * 7;

    onEnter(): void {}

    update(): void {
        if (this.duck.timeInState > this.randomMovementTime) {
            this.duck.target = WindowToWorld(window.innerWidth * Math.random(), window.innerHeight * Math.random());
            this.duck.state = new StateApproachingTarget(this.duck);
        }
    }
}

export class StateApproachingTarget extends State {
    name: string = 'approaching target';

    onEnter(): void {
        
    }

    update(dt: number): void {
        //this.duck.moveTowardsTarget(dt);
    }
}