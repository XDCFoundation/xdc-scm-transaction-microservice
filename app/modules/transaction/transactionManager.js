import Utils from "../../utils";
import TransactionModel from "../../models/transaction";
import {
  apiSuccessMessage,
  apiFailureMessage,
  httpConstants,
} from "../../common/constants";

export default class TransactionManager {
  async addTransaction(requestData) {
    const transactionObject = new TransactionModel(requestData);
    const response = await transactionObject.save();
    return response;
  }
  getTransactionList = async (requestData) => {
    const transactionListRequest = this.parseGettransactionListRequest(
      requestData
    );
    const transactionList = await TransactionModel.getTransactionList(
      transactionListRequest.requestData,
      transactionListRequest.selectionKeys,
      transactionListRequest.skip,
      transactionListRequest.limit,
      transactionListRequest.sortingKey
    );
    let totalCount = await TransactionModel.countData();
    return { transactionList, totalCount };
  };

  parseGettransactionListRequest = (requestObj) => {
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
    if (
      requestObj.searchKeys &&
      requestObj.searchValue &&
      Array.isArray(requestObj.searchKeys) &&
      requestObj.searchKeys.length
    ) {
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

  async normalizeTX(txData, receipt, timestamp) {
    if (!txData || !receipt || !timestamp) return;

    let contractAddress = "";
    if (receipt && receipt.contractAddress !== null) {
      contractAddress = receipt.contractAddress.toLowerCase();
    }

    let cumulativeGasUsed = 0;
    if (receipt && receipt.cumulativeGasUsed)
      cumulativeGasUsed = receipt.cumulativeGasUsed;

    let logs = [];
    if (receipt && receipt.logs.length > 0) logs = receipt.logs;

    let status = true;
    if (receipt && receipt.status) {
      status = receipt.status;
    }

    const tx = {
      blockHash: txData.blockHash || "",
      blockNumber: txData.blockNumber || 0,
      hash: txData.hash.toLowerCase() || "",
      from: txData.from.toLowerCase() || "",
      to: txData.to || "",
      gas: txData.gas || "",
      gasPrice: String(txData.gasPrice) || "",
      gasUsed: receipt.gasUsed || 0,
      input: txData.input || "",
      nonce: txData.nonce || 0,
      transactionIndex: txData.transactionIndex || 0,
      value: txData.value || "",
      r: txData.r || "",
      s: txData.s || "",
      v: txData.v || "",
      contractAddress: contractAddress || "",
      cumulativeGasUsed: cumulativeGasUsed || 0,
      logs: logs || [],
      status: status || false,
      timestamp: timestamp || 0,
      modifiedOn: Date.now(),
      createdOn: Date.now(),
      isDeleted: false,
      isActive: true,
    };

    if (txData.to) {
      tx.to = txData.to.toLowerCase() || "";
      return tx;
    } else if (txData.creates) {
      tx.creates = txData.creates.toLowerCase() || "";
      return tx;
    } else {
      tx.creates = receipt.contractAddress.toLowerCase() || "";
      return tx;
    }
  }
}
