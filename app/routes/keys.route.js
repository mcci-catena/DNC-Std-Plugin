const keyctrl = require('../controllers/keys.controller.js');

module.exports = (app) => {

    app.post('/fields', keyctrl.getfields);
    app.post('/tags', keyctrl.gettags);
    app.post('/tvals/:tkey', keyctrl.gettvals);
}