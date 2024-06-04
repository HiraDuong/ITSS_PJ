const router = require('express').Router();

const MqttController = require('../controller/MqttController');
router.post('/mqtt', MqttController.sendmessage);

module.exports = router;