import {httpConstants} from "../common/constants";
import HTTPService from "./http-service";
import Config from "../../config"

const ERC20_METHOD_DIC = {
    "a9059cbb": "transfer(address,uint256)",
    "a978501e": "transferFrom",
    "8c5be1e5": "approval(address,address,uint256)",
    "253279ad": "initialize(string,string,uint8,uint256)",
    "095ea7b3": "approve(address,uint256)"
}

export default class XdcService {
    static async getTransactionsCountForContract(contractAddress) {
        const transactionListResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getTransactionsCountForAddress/${contractAddress}`, {}, {}, true)
        return !transactionListResponse || !transactionListResponse.success ? 0 : transactionListResponse.responseData;
    }

    static async getTransactionsForContract(contractAddress, skip, limit) {
        const transactionListResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getTransactionsForAddress/${contractAddress}?skip=${skip}&limit=${limit}`, {}, {}, true)
        return !transactionListResponse || !transactionListResponse.success ? null : transactionListResponse.responseData;
    }

    static async getMethodName(input) {
        const methodString = input.substring(2, 10)
        if (ERC20_METHOD_DIC[methodString])
            return ERC20_METHOD_DIC[methodString];
        return await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/", methodString, {},);
    }

    static async getSCMSystemContracts(contractArray) {
        const systemContractsResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.POST, Config.CONTRACT_SERVICE_BASE_URL, "scm-contracts", {contracts: contractArray});
        return !systemContractsResponse || !systemContractsResponse.success ? null : systemContractsResponse.responseData;
    }
}
