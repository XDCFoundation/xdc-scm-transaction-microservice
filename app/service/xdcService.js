import { httpConstants } from "../common/constants";
import HTTPService from "./http-service";
import Config from "../../config";
import { functionConstants } from "../common/constants";

const ERC20_METHOD_DIC = {
  "a9059cbb": functionConstants.TRANSFER,
  "a978501e": functionConstants.TRANSFER_FROM,
  "8c5be1e5": functionConstants.APPROVAL,
  "253279ad": functionConstants.INITIALIZE,
  "095ea7b3": functionConstants.APPROVE,
  "40c10f19": functionConstants.MINT,
  "8456cb59": functionConstants.PAUSE,
  "3f4ba83a": functionConstants.RESUME,
  "f1c064af": functionConstants.OWNERSHIP,
  "42966c68": functionConstants.BURN,
};

export default class XdcService {
  static async getTransactionsCountForContract(contractAddress) {
    const transactionListResponse = await HTTPService.executeHTTPRequest(
      httpConstants.METHOD_TYPE.GET,
      Config.XDC_MAIN_NET_BASE_URL,
      `getTransactionsCountForAddress/${contractAddress}`,
      {},
      {},
      true
    );
    return !transactionListResponse || !transactionListResponse.success
      ? 0
      : transactionListResponse.responseData;
  }

  static async getTransactionsForContract(contractAddress, skip, limit) {
    const transactionListResponse = await HTTPService.executeHTTPRequest(
      httpConstants.METHOD_TYPE.GET,
      Config.XDC_MAIN_NET_BASE_URL,
      `getTransactionsForAddress/${contractAddress}?skip=${skip}&limit=${limit}`,
      {},
      {},
      true
    );
    return !transactionListResponse || !transactionListResponse.success
      ? null
      : transactionListResponse.responseData;
  }

  static async getMethodName(input) {
    const methodString = input.substring(2, 10);
    if (ERC20_METHOD_DIC[methodString]) return ERC20_METHOD_DIC[methodString];
    return await HTTPService.executeHTTPRequest(
      httpConstants.METHOD_TYPE.GET,
      "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/",
      methodString,
      {}
    );
  }

  static async getSCMSystemContracts(contractArray) {
    const systemContractsResponse = await HTTPService.executeHTTPRequest(
      httpConstants.METHOD_TYPE.POST,
      Config.CONTRACT_SERVICE_BASE_URL,
      "scm-contracts",
      { contracts: contractArray }
    );
    return !systemContractsResponse || !systemContractsResponse.success
      ? null
      : systemContractsResponse.responseData;
  }

  static async getSCMContractDetail(requestData) {
    const contractResponse = await HTTPService.executeHTTPRequest(
      httpConstants.METHOD_TYPE.POST,
      Config.CONTRACT_DETAIL,
      `scm-contract-detail`,
      requestData,
      { "x-api-key": Config.SCM_X_API_KEY }
    );
    return !contractResponse ||
      !contractResponse.success ||
      !contractResponse.responseData ||
      !Object.keys(contractResponse.responseData).length
      ? null
      : {
          ...contractResponse.responseData,
        };
  }
}
