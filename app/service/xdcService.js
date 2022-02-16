import {httpConstants} from "../common/constants";
import HTTPService from "./http-service";
import Config from "../../config"


export default class XdcService {
    static async getTransactionsForContract(contractAddress) {
        const transactionListResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getTransactionsForAddress/${contractAddress}?skip=0&limit=100`, {},)
        return !transactionListResponse || !transactionListResponse.success ? null : transactionListResponse.responseData;
    }
}
