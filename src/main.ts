import Debug from './lib/Debug';
import Game from './lib/Game';
import './style.scss';
import WebGL from 'three/examples/jsm/capabilities/WebGL';

// Checking if WebGL is supported
if (WebGL.isWebGLAvailable()) {
    const game = new Game();
    new Debug(game);
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
