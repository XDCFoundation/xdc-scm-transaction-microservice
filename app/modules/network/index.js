import BLManager from "./networkManager";
import Utils from "../../utils";
import { apiSuccessMessage, httpConstants } from "../../common/constants";
// import NetworkManager from "./networkManager";

export default class NetworkController {
  async addNetwork(request, response) {
    lhtWebLog("Inside addNetwork", request.body, "addNetwork", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().addNetwork(request.body));
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
  async getNetworksList(request, response) {
    lhtWebLog("Inside getNetworksList", request.body, "getNetworksList", 0, "");
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getNetworksList(request.body));
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
