import {httpConstants} from "../common/constants";
import Config from "../../config";
import Web3 from "xdc3";

export default class WebSocketService {
    static connect() {
        lhtWebLog('webSocketConnection', 'connecting to ', Config.WS_URL, 'AyushK')
        try {
            global.web3 = new Web3(new Web3.providers.WebsocketProvider(Config.WS_URL, {
                clientConfig: {
                    keepalive: true,
                    keepaliveInterval: 60000,
                },
                reconnect: {
                    auto: true,
                    delay: 2500,
                    onTimeout: true,
                }
            }));
            return true;
        } catch (err) {
            lhtWebLog('webSocketConnection', 'error in connection ', err, 'AyushK', httpConstants.LOG_LEVEL_TYPE.ERROR)
            throw err
        }
    }
}
