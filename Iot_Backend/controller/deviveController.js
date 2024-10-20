import connection from "../database.js";
import client from "../mqtt/mqttClient.js";
export const ControlDevice = async(req, res) => {
    const device= req.query.device;
    const state = req.query.state;
    console.log(state);

    if (state === "on" || state === "off") {
        // Đặt một callback để lắng nghe phản hồi từ MQTT
        const mqttResponse = async(topic, message) => {
            if (topic === 'home/device/status') {
                const status = message.toString();
                console.log(`Received Device status: ${status}`);

                if (status === state) {
                    // Lưu hành động vào database MySQL
                    const actionStr = state === 'on' ? 'Bật' : 'Tắt';
                    const sql = `INSERT INTO actions (Device, Action, TimeAction) VALUES (?, ?, NOW())`;
                    const values = [device, actionStr];
                    console.log(sql);
                    try{
                        const rs= await connection.query(sql, values);
                        res.status(200).json({ fanState: state });
                    }catch(e)
                    {
                        res.status(500).json({ message: 'Failed to save action to database' });
                    }
            
                } else {
                    res.status(500).json({ message: 'Failed to change Device state' });
                }

                // Loại bỏ listener sau khi nhận được phản hồi
                client.removeListener('message', mqttResponse);
            }
        };

        // Đăng ký listener cho phản hồi từ MQTT
        client.on('message', mqttResponse);

        // Gửi yêu cầu bật/tắt quạt qua MQTT
        if(device== 'Air')
        {
            client.publish('control/air', state);
        }
        else{
            if(device== "Led")
            {
                client.publish('control/led', state);
            }
            else{
                if(device== "Fan")
                    {
                        client.publish('control/fan', state);
                    }
            }
        }
       
        
        client.subscribe('home/device/status',(e)=>{
             if( e) console.error("error subcribe control/device");})

    } else {
        console.log(state);
        res.status(400).json({ message: 'Invalid state' });
    }
};
