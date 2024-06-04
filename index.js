const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mqttRouter = require('./routes/MqttRoute');
const WebSocket = require('ws');

app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./node_modules'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/api', mqttRouter);
app.get('/', (req, res) => {
    res.render('index');
});

// MQTT connection
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.emqx.io');

// WebSocket Server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});

client.on('connect', () => {
    console.log('MQTT connected');
    client.subscribe('ITSS_JP_2');
    client.subscribe('ITSS_JP_2_2');
    client.publish('ITSS_JP_2', 'Hello MQTT');
});

client.on('message', (topic, message) => {
    const messageString = message.toString();
    

    if (topic === 'ITSS_JP_2_2') {
        console.log('received message %s %s', topic, messageString);
        // Broadcast message to all WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    }
});
