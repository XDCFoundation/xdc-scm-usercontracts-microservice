import BLManager from './manager';

export default class RabbitMqController {

    async initializeRabbitMQListener() {
        return await new BLManager().initializeRabbitMQListener();
    };

    insertInQueue(payload, operationType) {
        switch (operationType) {
            case "CONTRACT_ADDED":
                return new BLManager().insertDataInQueue({payload, operationType});
            default:
                return new BLManager().insertDataInQueue({payload, operationType});
        }
    }
};
