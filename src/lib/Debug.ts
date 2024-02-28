import Game from './Game';
import Duck from './entities/Duck/Duck';

export default class Debug {
    game: Game;

    constructor(game: Game) {
        this.game = game;
        document
            .getElementById('debug-make-ducks-hungry')
            ?.addEventListener('click', () => {
                Object.values(Duck.ducks).forEach(
                    (duck) => (duck.hunger = -999)
                );
            });
    }
}
