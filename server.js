import APP from 'express'
import DBConnection from './config/dbConnection'
import Utils from './app/utils'
import Config from './config'
import routes from './routes'
import {httpConstants} from './app/common/constants'
import WebSocketService from "./app/service/WebsocketService";

const app = new APP()
require('./config/express')(app)
global.lhtWebLog = Utils.lhtLog

class Server {

    static startNodeApp = () => {
        app.listen(Config.PORT)
        routes(app)
        require('./config/jobInitializer')
    }

    static listen() {
        Promise.all([DBConnection.connect(), WebSocketService.connect(Config.WS_URL)]).then(async () => {
            lhtWebLog('listen', `Server Started on port ${Config.PORT}`, {}, 'AyushK', httpConstants.LOG_LEVEL_TYPE.INFO)
            Server.startNodeApp()
        }).catch(error => lhtWebLog('listen', 'failed to connect', {error}, 'AyushK', httpConstants.LOG_LEVEL_TYPE.ERROR))
    }
}

Server.listen()
