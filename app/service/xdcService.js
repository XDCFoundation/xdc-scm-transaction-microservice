import {httpConstants} from "../common/constants";
import HTTPService from "./http-service";
import Config from "../../config"


export default class XdcService {
    static async getTransactionsCountForContract(contractAddress) {
        const transactionListResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getTransactionsCountForAddress/${contractAddress}`, {},)
        return !transactionListResponse || !transactionListResponse.success ? 0 : transactionListResponse.responseData;
    }

    static async getTransactionsForContract(contractAddress, skip, limit) {
        const transactionListResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getTransactionsForAddress/${contractAddress}?skip=${skip}&limit=${limit}`, {},)
        return !transactionListResponse || !transactionListResponse.success ? null : transactionListResponse.responseData;
    }
}
