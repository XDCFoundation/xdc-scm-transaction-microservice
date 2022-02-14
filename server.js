import APP from 'express'
import DBConnection from './config/dbConnection'
import Utils from './app/utils'
import Config from './config'
import routes from './routes'
import {httpConstants} from './app/common/constants'
import AMQP from "./library";
import QueueController from "./app/modules/queue";

const app = new APP()
require('./config/express')(app)
global.lhtWebLog = Utils.lhtLog

class Server {
    static listen() {
        Promise.all([DBConnection.connect(), AMQP.conn(Config.AMQP_HOST_URL, true)]).then(async () => {
            app.listen(Config.PORT)
            routes(app)
            await new QueueController().initializeRabbitMQListener();
            Utils.lhtLog('listen', `Server Started on port ${Config.PORT}`, {}, 'AyushK', httpConstants.LOG_LEVEL_TYPE.INFO)

        }).catch(error => Utils.lhtLog('listen', 'failed to connect', {err: error}, 'AyushK', httpConstants.LOG_LEVEL_TYPE.ERROR))
    }
}

Server.listen()
