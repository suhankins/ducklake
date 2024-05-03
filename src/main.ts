import Debug from './lib/Debug';
import Game from './lib/Game';
import './style.scss';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { registerSW } from 'virtual:pwa-register';

// Checking if WebGL is supported
if (WebGL.isWebGLAvailable()) {
    const game = new Game();
    new Debug(game);
    const updateSW = registerSW({
        onNeedRefresh() {
            if (confirm('New content available. Reload?')) {
                updateSW(true);
            }
        },
    });
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
