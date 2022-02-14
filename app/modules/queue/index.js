import BLManager from './manager';
import {amqpConstants} from "../../common/constants";

export default class RabbitMqController {

    async initializeRabbitMQListener() {
        return await new BLManager().initializeRabbitMQListener();
    };

    async insertInQueue(queueData, operationType) {
        switch (operationType) {
            default:
                return await new BLManager().insertObjInUpdateContentServiceQueue(queueData);
        }
    }
};
