const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();

module.exports = class Message {
    constructor(to, body) {
        return hydra.createUMFMessage({
            to: to,
            body: body,
            from: 'users-service:/'
        });
    }
};