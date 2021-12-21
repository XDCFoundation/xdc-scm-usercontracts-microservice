import {httpConstants} from "../common/constants";
import Config from "../../config";
import Web3 from "xdc3";

export default class WebSocketService {
    static connect() {
        lhtWebLog('webSocketConnection', 'connecting to ', Config.WS_URL)
        try {
            global.web3 = new Web3(new Web3.providers.WebsocketProvider(Config.WS_URL));
            return true;
        } catch (err) {
            lhtWebLog('webSocketConnection', 'error in connection ', err, 'AyushK', httpConstants.LOG_LEVEL_TYPE.ERROR)
            throw err
        }
    }
}
