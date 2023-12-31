import Game from './lib/Game';
import './style.css';
import WebGL from 'three/examples/jsm/capabilities/WebGL';

// Checking if WebGL is supported
if (WebGL.isWebGLAvailable()) {
    new Game();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
