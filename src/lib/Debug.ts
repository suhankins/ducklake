import Duck from './entities/Duck/Duck';
import StateDisappointed from './entities/Duck/states/StateDisappointed';
import StateIdle from './entities/Duck/states/StateIdle';
import StateShocked from './entities/Duck/states/StateShocked';
import Thought from './entities/VFX/Thought/Thought';

import type Game from './Game';

export default class Debug {
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.setupMakeDucksHungry();
        this.setupSpawnManyDucks();
        this.setupMakeDucksQuack();
        this.setupToggleDebugText();
        this.setupMakeDucksThinkBread();
        this.setupDisappointDucks();
        this.setupShockDucks();
    }

    setupMakeDucksHungry() {
        document
            .getElementById('debug-make-ducks-hungry')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach(
                    (duck) => (duck.hunger = -999)
                );
            });
    }

    setupMakeDucksQuack() {
        document
            .getElementById('debug-duck-quack')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach((duck) => duck.quack());
            });
    }

    setupMakeDucksThinkBread() {
        document
            .getElementById('debug-duck-think-bread')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach((duck) =>
                    duck.emote(new Thought(this.game, 'bread', duck))
                );
            });
    }

    setupDisappointDucks() {
        document
            .getElementById('debug-disappoint-ducks')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach(
                    (duck) =>
                        (duck.state = new StateDisappointed(
                            duck,
                            () => new StateIdle(duck)
                        ))
                );
            });
    }

    setupShockDucks() {
        document
            .getElementById('debug-shock-ducks')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach(
                    (duck) =>
                        (duck.state = new StateShocked(
                            duck,
                            () => new StateIdle(duck)
                        ))
                );
            });
    }

    setupSpawnManyDucks() {
        document
            .getElementById('debug-spawn-ten-ducks')
            ?.addEventListener('click', () => {
                for (let i = 0; i < 10; i++)
                    this.game.addEntity(new Duck(this.game));
            });
    }

    setupToggleDebugText() {
        const debugTextToggle = document.getElementById(
            'debug-text'
        ) as HTMLInputElement;

        this.game.debugTextEnabled = debugTextToggle.checked;
        debugTextToggle.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            this.game.debugTextEnabled = target.checked;
        });
    }
}
