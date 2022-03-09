import BLManager from './manager';

export default class RabbitMqController {

    async initializeRabbitMQListener() {
        return await new BLManager().initializeRabbitMQListener();
    };
    async insertInQueue(
        exchangeName,
        queueName,
        replyQueue,
        topicKey,
        routingKey,
        replyKey,
        requestKey,
        exchangeType,
        queueType,
        queueData
      ) {
        return await new BLManager().insertInQueue(
          exchangeName,
          queueName,
          replyQueue,
          topicKey,
          routingKey,
          replyKey,
          requestKey,
          exchangeType,
          queueType,
          queueData
        );
      }
    // async insertInQueue(queueData, operationType) {
    //     switch (operationType) {
    //         default:
    //             return await new BLManager().insertObjIUpdateContentServiceQueue(queueData);
    //     }
    // }
    
};
