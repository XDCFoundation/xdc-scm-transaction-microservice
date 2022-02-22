const request = require('request')
const {httpConstants} = require("../common/constants");
import Config from "../../config"

class HTTPService {

    static getHeaders() {
        return {
            "Content-Type": httpConstants.HEADER_TYPE.APPLICATION_JSON,
            "X-API-key": Config.XDC_X_API_KEY,
        };
    }

    /**
     * execute Http request
     */
    static async executeHTTPRequest(method, hostname, path, data, headers, defaultHeaders = false) {
        if (defaultHeaders) headers = {...HTTPService.getHeaders(), ...headers}
        return await new Promise(function (fulfill, reject) {
            request({
                url: hostname + path,
                method: method,
                headers: headers,
                json: data
            }, function (error, response, body) {
                // console.log('body:-', body);
                if (error) {
                    console.log('err' + error)
                    reject(error)
                } else {
                    fulfill(body)
                }
            })
        })
    }
}

module.exports = HTTPService
