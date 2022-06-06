import AMQPController from "../../../library";
import Config from "../../../config";
import {amqpConstants, apiFailureMessage} from "../../common/constants";
import TransactionManager from "../transaction/transactionManager";

export default class RabbitMQ {
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
        return await AMQPController.insertInQueue(
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

    async insertObjInUpdateContentServiceQueue(queueData) {
        // return await AMQPController.insertInQueue(Config.TRANSACTION_EXCHANGE, Config.TRANSACTION_QUEUE, {}, {}, {}, {}, {}, {}, AMQP_CONSTANTS.EXCHANGE_TYPE_FANOUT, AMQP_CONSTANTS.PUBLISHER_SUBSCRIBER_QUEUE, queueData);
    }

    async initializeRabbitMQListener() {
        await AMQPController.getFromQueue(Config.TRANSACTION_EXCHANGE, Config.TRANSACTION_QUEUE, amqpConstants.exchangeType.FANOUT, amqpConstants.queueType.PUBLISHER_SUBSCRIBER_QUEUE, RabbitMQ.publishUpdateHandler, {}, {});
    };

    static publishUpdateHandler(channel, queueData) {
        try {
            let parsedData = JSON.parse(queueData);
            if (!parsedData || !parsedData.operationType)
                return lhtWebLog('publishUpdateHandler check error', apiFailureMessage.INVALID_REQUEST, parsedData);
            switch (parsedData.operationType) {
                case "CONTRACT_ADDED":
                    return new TransactionManager().fetchTransactionForNewContract(parsedData.payload);
                case "BLOCK_RECEIVED_FROM_FOLLOWER":
                    return new TransactionManager().saveNewTransactionsIntoDB(parsedData.payload);
            }

        } catch (error) {
            return lhtWebLog('publishUpdateHandler catch', apiFailureMessage.INVALID_REQUEST, error);
        }
    }
}

