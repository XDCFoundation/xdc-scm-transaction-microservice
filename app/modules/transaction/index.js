import TransactionManager from "./transactionManager";
import BLManager from "./transactionManager";
import Utils from "../../utils";
import { apiSuccessMessage, httpConstants } from "../../common/constants";

export default class TransactionController {
  async addTransaction(request, response) {
    lhtWebLog("Inside addTransaction", request.body, "addTransaction", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().addTransaction(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  async getTransactionList(request, response) {
    lhtWebLog("Inside getTransactionList", request.body, "getTransactionList", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getTransactionList(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  async getTransactionAnalytics(request, response) {
    lhtWebLog("Inside getTransactionAnalytics", request.body, "getTransactionAnalytics", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getTransactionAnalytics(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }
   async getGasUsedAnalytics(request, response) {
    lhtWebLog("Inside getGasUsedAnalytics", request.body, "getGasUsedAnalytics", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getGasUsedAnalytics(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  async getActiveUsersAnalytics(request, response) {
    lhtWebLog("Inside getGasUsedAnalytics", request.body, "getGasUsedAnalytics", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getActiveUsers(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  async getTopCallers(request, response) {
    lhtWebLog("Inside getTopCallers", request.body, "getTopCallers", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getTopCallers(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  async getTopFunctionCalls(request, response) {
    lhtWebLog("Inside getTopFunctionCalls", request.body, "getTopFunctionCalls", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getTopFunctionCalls(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  } 


  async getTGasPriceInUSD(request, response) {
    lhtWebLog("Inside getTGasPriceInUSD", request.body, "getTGasPriceInUSD", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getTGasPriceInUSD(request.body));
    if (!getMetersRes) {
      return Utils.handleError(error, request, response);
    }
    return Utils.response(
      response,
      getMetersRes,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }
}
