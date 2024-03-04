import Duck from './entities/Duck/Duck';

import type Game from './Game';

export default class Debug {
    constructor(game: Game) {
        document
            .getElementById('debug-make-ducks-hungry')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach(
                    (duck) => (duck.hunger = -999)
                );
            });
        document
            .getElementById('debug-spawn-ten-ducks')
            ?.addEventListener('click', () => {
                for (let i = 0; i < 10; i++) game.addEntity(new Duck(game));
            });
        document
            .getElementById('debug-text')
            ?.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                game.debugTextEnabled = target.checked;
            });
    }
}
