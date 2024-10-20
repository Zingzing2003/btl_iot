import  Express  from 'express';
import {GetHistoryAction} from '../controller/historyController.js';
import { getAllSensors, GetTopSensors } from '../controller/sensorController.js';
import { ChangeAir } from '../controller/airController.js';
import { ChangeFan } from '../controller/fanController.js';
import { ChangeLed } from '../controller/ledController.js';
const router = Express.Router();
const InitWebRoutes=async (app)=>{
    //router.get('/api/get-all-data',HandleGetData );
    router.get('/api/get-history-action',GetHistoryAction);
    router.get('/api/get-all-sensors', getAllSensors);
    router.get('/api/get-top-sensors', GetTopSensors);
    router.post('/api/control-air', ChangeAir );
    router.post('/api/control-fan', ChangeFan);
    router.post('/api/control-led', ChangeLed);

    return app.use("/", router);
}
export default InitWebRoutes;