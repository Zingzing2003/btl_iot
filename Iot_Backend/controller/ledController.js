import connection from "../database.js";
import client from "../mqtt/mqttClient.js";
export const ChangeLed = async(req, res) => {
    const state = req.query.state;
    console.log(state);

    if (state === "on" || state === "off") {
        // Đặt một callback để lắng nghe phản hồi từ MQTT
        const mqttResponse = async(topic, message) => {
            if (topic === 'home/device/status') {
                const status = message.toString();
                console.log(`Received Led status: ${status}`);

                if (status === state) {
                    // Lưu hành động vào database MySQL
                    const actionStr = state === 'on' ? 'Bật' : 'Tắt';
                    const sql = `INSERT INTO actions (SensorName, Action, TimeAction) VALUES (?, ?, NOW())`;
                    const values = ['Led', actionStr];
                    try{
                        const rs= await connection.query(sql, values);
                        res.status(200).json({ fanState: state });
                    }catch(e)
                    {
                        res.status(500).json({ message: 'Failed to save action to database' });
                    }
            
                } else {
                    res.status(500).json({ message: 'Failed to change Fan state' });
                }

                // Loại bỏ listener sau khi nhận được phản hồi
                client.removeListener('message', mqttResponse);
            }
        };

        // Đăng ký listener cho phản hồi từ MQTT
        client.on('message', mqttResponse);

        // Gửi yêu cầu bật/tắt quạt qua MQTT
        client.publish('control/led', state);
        client.subscribe('home/device/status',(e)=>{
             if( e) console.error("error subcribe control/led");})

    } else {
        console.log(state);
        res.status(400).json({ message: 'Invalid state' });
    }
};
