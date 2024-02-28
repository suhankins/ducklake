import Debug from './lib/Debug';
import Game from './lib/Game';
import './style.scss';
import WebGL from 'three/examples/jsm/capabilities/WebGL';

// Checking if WebGL is supported
if (WebGL.isWebGLAvailable()) {
    new Game();
    new Debug();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
