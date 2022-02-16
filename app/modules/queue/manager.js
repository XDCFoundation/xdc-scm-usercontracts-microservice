import AMQPController from "../../../library";
import Config from "../../../config";
import {amqpConstants, apiFailureMessage} from "../../common/constants";

export default class RabbitMQ {

    async insertDataInQueue(queueData) {
        return await AMQPController.insertInQueue(Config.TRANSACTION_EXCHANGE, Config.TRANSACTION_QUEUE, {}, {}, {}, {}, {}, amqpConstants.exchangeType.FANOUT, amqpConstants.queueType.PUBLISHER_SUBSCRIBER_QUEUE, queueData);
    }

    async initializeRabbitMQListener() {
        // await AMQPController.getFromQueue(Config.BLOCKCHAIN_FOLLOWER_TXN_EXCHANGE, Config.BLOCKCHAIN_FOLLOWER_TXN_QUEUE, amqpConstants.exchangeType.FANOUT, amqpConstants.queueType.PUBLISHER_SUBSCRIBER_QUEUE, RabbitMQ.publishUpdateHandler, {}, {});
    };

    static publishUpdateHandler(channel, payload) {
        try {
            let parsedPayload = JSON.parse(payload);
            let requestData;
            if (!parsedPayload || !parsedPayload.txnList)
                return lhtWebLog('publishUpdateHandler check error', apiFailureMessage.INVALID_REQUEST, payload);

        } catch (error) {
            return lhtWebLog('publishUpdateHandler catch', apiFailureMessage.INVALID_REQUEST, error);
        }
    }
}
