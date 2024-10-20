import express from 'express';
import cors from 'cors';
import InitWebRoutes from "./routes/web.js";
//import connection from './database.js';
import bodyParser from "body-parser";
import client from './mqtt/mqttClient.js';
import connection from './database.js';
const app = express();
const port = 8080;

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
InitWebRoutes(app);
// Route cơ bản
app.get('/', (req, res) => {
  res.send('Hello World!');
 // console.log(express.Router());
});
//connection.getConnection();

client.on('message',async (topic, message) => {
  if (topic === 'iot') {
    
    const data = message.toString();
    try {
      const parsedData = JSON.parse(data);
      // Trích xuất nhiệt độ, độ ẩm và ánh sáng từ dữ liệu
      const temperature = parsedData.temperature;
      const humidity = parsedData.humidity;
      const light = parsedData.light;
     
      // Kiểm tra và lưu dữ liệu vào cơ sở dữ liệu MySQL
      if (temperature && humidity && light) {
        
        const sql = `INSERT INTO sensors (Temperature, Humidity, Light) VALUES (?, ?, ?)`;
        const values = [
          parseFloat(temperature),
          parseFloat(humidity),
          parseFloat(light)
        ];

        const rs= await connection.query(sql, values);
        //console.log(rs);
        //, (error, results) => {
        //   console.log("oke");
        //   if (error) {
           
        //     console.error('Error inserting sensor data into database:', error);
        //   } else {
        //     console.log('Sensor data saved successfully:', results);
        //   }
        // });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }
});


app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
