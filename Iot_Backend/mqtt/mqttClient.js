import mqtt from 'mqtt';

const config = {
    port : 1883,
    host: '192.168.32.180',
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    username: 'Dinh',
    password: 'b21dccn228'
};

const client = mqtt.connect(config);

client.on('connect', ()=>{
    console.log("check connect");
    client.subscribe('iot',(e)=>{
       if( e) console.error("error subcribe iot");
       
    });
    client.subscribe('control/led',(e)=>{
        if( e) console.error("error subcribe control/led");
    });
    client.subscribe('control/fan',(e)=>{
        if( e) console.error("error subcribe control/fan");
    });
    client.subscribe('control/air',(e)=>{
        if( e) console.error("error subcribe control/air");
    });
})
export default client;