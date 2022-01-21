import Utils from "../../utils";

import { apiSuccessMessage, apiFailureMessage, httpConstants } from "../../common/constants";
import NetworkModel from "../../models/network";

export default class NetworkManager {
  async addNetwork(requestData) {
    const networkObject = new NetworkModel(requestData);
    const response = await networkObject.save();
    return response;
  }

  getNetworksList = async (requestData) => {
    // if (!requestData.userId || requestData.userId === "")
    //   return Utils.returnRejection(apiFailureMessage.USER_ID_MISSING, httpConstants.RESPONSE_CODES.NOT_FOUND);

    if (!requestData) requestData = {};
    const networkListRequest = this.parseGetNetworkListRequest(requestData);
    const networkList = await NetworkModel.getNetworksList(
      networkListRequest.requestData,
      networkListRequest.selectionKeys,
      networkListRequest.skip,
      networkListRequest.limit,
      networkListRequest.sortingKey
    );
    let totalCount = await NetworkModel.countData();
    return { networkList, totalCount };
  };
  parseGetNetworkListRequest = (requestObj) => {
    if (!requestObj) return {};
    let skip = 0;
    if (requestObj.skip || requestObj.skip === 0) {
      skip = requestObj.skip;
      delete requestObj.skip;
    }
    let limit = 0;
    if (requestObj.limit) {
      limit = requestObj.limit;
      delete requestObj.limit;
    }
    let sortingKey = "";
    if (requestObj.sortingKey) {
      sortingKey = requestObj.sortingKey;
      delete requestObj.sortingKey;
    }
    let selectionKeys = "";
    if (requestObj.selectionKeys) {
      selectionKeys = requestObj.selectionKeys;
      delete requestObj.selectionKeys;
    }
    let searchQuery = [];
    if (requestObj.searchKeys && requestObj.searchValue && Array.isArray(requestObj.searchKeys) && requestObj.searchKeys.length) {
      requestObj.searchKeys.map((searchKey) => {
        let searchRegex = { $regex: requestObj.searchValue, $options: "i" };
        searchQuery.push({ [searchKey]: searchRegex });
      });
      requestObj["$or"] = searchQuery;
    }
    if (requestObj.searchKeys) delete requestObj.searchKeys;
    if (requestObj.searchValue) delete requestObj.searchValue;
    return {
      requestData: requestObj,
      skip: skip,
      limit: limit,
      sortingKey: sortingKey,
      selectionKeys: selectionKeys,
    };
  };
}
