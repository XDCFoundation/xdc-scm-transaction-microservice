import Config from ".";
import mongoose from "mongoose";

const fs = require("fs");

export default class DBConnection {
    static async connect() {
        lhtWebLog('connect', `DB trying to connect to url `, Config.DB, 'AyushK')
        const caContent = [fs.readFileSync(__dirname + "/" + Config.RDS_FILE),];

        const options = {
            keepAlive: 1,
            autoReconnect: true,
            poolSize: 10,
            ssl: true,
            sslValidate: false,
            sslCA: caContent,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            retryWrites:false
        };
        await mongoose.connect(Config.DB, options);
        return true;
    }
}
