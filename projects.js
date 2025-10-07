const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/projectController');
r.use(auth);
r.get('/', c.list);
r.post('/', c.create);
r.patch('/:id', c.update);
r.delete('/:id', c.remove);
module.exports = r;
