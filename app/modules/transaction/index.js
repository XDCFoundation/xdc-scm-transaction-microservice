import TransactionManager from "./transactionManager";
import BLManager from "./transactionManager";
import Utils from "../../utils";
import { apiSuccessMessage, httpConstants } from "../../common/constants";

export default class TransactionController {
  async addTransaction(request, response) {
    lhtWebLog("Inside addContract", request.body, "addContract", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(
      new BLManager().addTransaction(request.body)
    );
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
    lhtWebLog("Inside addContract", request.body, "addContract", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(
      new BLManager().getTransactionList(request.body)
    );
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
