import TransactionModel from "../../models/transaction";
import XdcService from "../../service/xdcService";
import moment from "moment";
import Config from "../../../config";
import { amqpConstants } from "../../common/constants";
import AMQPController from "../../../library";
import Utils from "../../utils";
import {
  httpConstants,
  apiFailureMessage,
} from "../../common/constants";
const fetch = require("node-fetch");


export default class TransactionManager {
  async addTransaction(requestData) {
    const transactionObject = new TransactionModel(requestData);
    const response = await transactionObject.save();
    return response;
  }
  getTransactionList = async (requestData) => {
    const transactionListRequest = this.parseGettransactionListRequest(requestData);
    const transactionList = await TransactionModel.getTransactionList(
      transactionListRequest.requestData,
      transactionListRequest.selectionKeys,
      transactionListRequest.skip,
      transactionListRequest.limit,
      transactionListRequest.sortingKey
    );
    let totalCount = await TransactionModel.countData(transactionListRequest.requestData);
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
    let date = {};
    if(requestObj.date){
      date = requestObj.date;
      delete requestObj.date;
      requestObj["date"] = {$gte: new Date(date.fromDate), $lte : new Date(date.toDate)}
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

  async normalizeTX(txData, receipt, timestamp) {
    if (!txData || !receipt || !timestamp) return;

    let contractAddress = "";
    if (receipt && receipt.contractAddress !== null) {
      contractAddress = receipt.contractAddress.toLowerCase();
    }

    let cumulativeGasUsed = 0;
    if (receipt && receipt.cumulativeGasUsed) cumulativeGasUsed = receipt.cumulativeGasUsed;

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

    saveNewTransactionsIntoDB = async (transactionList) => {
        if (!transactionList || !transactionList.length) return
        for (let txnData of transactionList) {
            delete txnData._id;
            txnData.contractAddress = txnData.contractAddress || txnData.to
            txnData.date = new Date(txnData.timestamp * 1000)
            txnData.network = "XDC Mainnet"
            txnData.function = await XdcService.getMethodName(txnData.input)
            lhtWebLog("saveNewTransactions", `Saving transaction for ${txnData.contractAddress} - ${txnData.function}`)
        }
        await TransactionModel.collection.insertMany(transactionList);
        await AMQPController.insertInQueue(Config.ALERT_EXCHANGE, Config.ALERT_QUEUE, "", "", "", "", "", amqpConstants.exchangeType.FANOUT, amqpConstants.queueType.PUBLISHER_SUBSCRIBER_QUEUE, transactionList);
        lhtWebLog("saveNewTransactions", `${transactionList.length} Transactions added to DB`)
    }

    fetchTransactionForNewContract = async ({contractAddress}) => {
        if (!contractAddress) return
        const transactionsExists = await TransactionModel.getTransaction({contractAddress});
        if (transactionsExists) {
            lhtWebLog("fetchTransactionForNewContract", `Transactions already fetched for ${contractAddress} from Mainnet`)
            return
        }
        const transactionCount = await XdcService.getTransactionsCountForContract(contractAddress)
        if (!transactionCount) return
        let skip = 0, limit = 50;
        while (skip < transactionCount) {
            const transactionList = await XdcService.getTransactionsForContract(contractAddress, skip, limit)
            if (!transactionList || !transactionList.length) return
            for (let txnObj of transactionList) {
                delete txnObj._id;
                txnObj.contractAddress = txnObj.contractAddress || txnObj.to
                txnObj.date = new Date(txnObj.timestamp * 1000)
                txnObj.network = "XDC Mainnet"
                txnObj.function = await XdcService.getMethodName(txnObj.input)
            }
            await TransactionModel.collection.insertMany(transactionList);    
            skip += limit;
        }
        lhtWebLog("fetchTransactionForNewContract", `${transactionCount} Transactions fetched for ${contractAddress} from Mainnet`)
    }

    getTransactionByHash =async (requestData) =>{
      return await TransactionModel.getTransaction({ hash: requestData.hash});
    }

  getTransactionAnalytics = async (req) => {

    let numberOfDays = Number(req.numberOfDays);
    // let endTime = parseInt(moment().endOf("day").valueOf() / 1000);
    // let startTime = parseInt(moment().subtract(numberOfDays, "days").startOf("day").valueOf() / 1000);
    let startTime = moment.utc().subtract(numberOfDays, "days").startOf('day');
    let endTime = moment.utc().endOf('day');

    let response = await TransactionModel.aggregate(
        [{
          $match: {
            $and: [
              { "date": { "$gte": new Date(startTime), "$lte": new Date(endTime) } },
              { "contractAddress": req.address }
            ]
          }
        },
          {
            $group:
                {
                  _id:
                      {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                      },
                   failedTransactions: {
                        "$sum": { "$cond": [
                            { "$eq": [ "$status", false ] },
                            1,
                            0
                        ]}
                    },
                    successfullTransactions: {
                      "$sum": { "$cond": [
                          { "$eq": [ "$status", true ] },
                          1,
                          0
                      ]}
                  },
                  dateString: { $first: "$date" },
                  count : {$sum :1}
                }
          },
          { $sort: { dateString: 1 } },
          {
            $project:
                {
                  dateString:
                      {
                        $dateToString: { format: "%Y-%m-%d", date: "$dateString" }
                      },
                  count: 1,
                  _id: 0,
                  failedTransactions:1,
                  successfullTransactions:1
                }
          }
        ])

    return response;

  }
  getGasUsedAnalytics = async (req) => {

    let numberOfDays = Number(req.numberOfDays);
    // let endTime = parseInt(moment().endOf("day").valueOf() / 1000);
    // let startTime = parseInt(moment().subtract(numberOfDays, "days").startOf("day").valueOf() / 1000);
    let startTime = moment.utc().subtract(numberOfDays, "days").startOf('day');
    let endTime = moment.utc().endOf('day');

    let response = await TransactionModel.aggregate(
        [{
          $match: {
            $and: [
              { "date": { "$gte": new Date(startTime), "$lte": new Date(endTime) } },
              { "contractAddress": req.address }
            ]
          }
        },
          {
            $group:
                {
                  _id:
                      {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                      },
                  gasUsedOverTime: { $sum: "$gasUsed" },
                  dateString: { $first: "$date" }
                }
          },
          { $sort: { dateString: 1 } },
          {
            $project:
                {
                  dateString:
                      {
                        $dateToString: { format: "%Y-%m-%d", date: "$dateString" }
                      },
                  gasUsedOverTime: 1,
                  _id: 0
                }
          }
        ])

    return response;
  }

  getActiveUsers = async (req) => {

    let numberOfDays = Number(req.numberOfDays);
    // let endTime = parseInt(moment().endOf("day").valueOf() / 1000);
    // let startTime = parseInt(moment().subtract(numberOfDays, "days").startOf("day").valueOf() / 1000);
    let startTime = moment.utc().subtract(numberOfDays, "days").startOf('day');
    let endTime = moment.utc().endOf('day');

    let response = await TransactionModel.aggregate(
        [{
          $match: {
            $and: [
              { "date": { "$gte": new Date(startTime), "$lte": new Date(endTime) } },
              { "contractAddress": req.address }
            ]
          }
        },
          {
            $group:
                {
                  _id:
                      {
                        day: { $dayOfMonth: "$date" },
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                      },
                      addresses: { $addToSet: "$from" },
                      dateString: { $first: "$date" }
                }
      },
      { $sort: { dateString: 1 } },
      {
        $project:
        {
          dateString:
          {
            $dateToString: { format: "%Y-%m-%d", date: "$dateString" }
          },
          activeUsers: { $size: "$addresses" },
          addresses:1,
          _id: 0
        }
      }
      ])

    return response;
  }

  getTopCallers = async (req) => {

    let numberOfDays = Number(req.numberOfDays);
    // let endTime = parseInt(moment().endOf("day").valueOf() / 1000);
    // let startTime = parseInt(moment().subtract(numberOfDays, "days").startOf("day").valueOf() / 1000);
    let startTime = moment.utc().subtract(numberOfDays, "days").startOf('day');
    let endTime = moment.utc().endOf('day');

    let response = await TransactionModel.aggregate(
        [{
          $match: {
            $and: [
              { "date": { "$gte": new Date(startTime), "$lte": new Date(endTime) } },
              { "contractAddress": req.address }
            ]
          }
        },
          {
            $group:
                {
                  _id: "$from",
                  data: {$first:"$network"},
                  count : { $sum : 1}

                }
      },
      { $sort: { count: -1 } },
      {
        $project:
        {
          network:"$data",
          count:1,
          address: "$_id",
          _id:0
        }
      }
      ])

    return response;
  }

  getTopFunctionCalls = async (req) => {

    let numberOfDays = Number(req.numberOfDays);
    let startTime = moment.utc().subtract(numberOfDays, "days").startOf('day');
    let endTime = moment.utc().endOf('day');

    let response = await TransactionModel.aggregate(
        [{
          $match: {
            $and: [
              { "date": { "$gte": new Date(startTime), "$lte": new Date(endTime) } },
              { "contractAddress": req.address }
            ]
          }
        },
          {
            $group:
                {
                  _id: "$function",
                  data: {$first:"$network"},
                  count : { $sum : 1}

                }
      },
      { $sort: { count: -1 } },
      {
        $project:
        {
          network:"$data",
          count:1,
          function: "$_id",
          _id:0
        }
      }
      ])

    return response;
  }

  getTGasPriceInUSD = async (requestData) => {
    if (!requestData.gasPrice) {
      throw Utils.error(
        {},
        apiFailureMessage.INVALID_PARAMS,
        httpConstants.RESPONSE_CODES.FORBIDDEN
    );
    }
    let usdP=await usdPrice()
    let gasPrice=requestData.gasPrice;
    let xdcPrice=usdP;
    const wei = 0.000000000000000001;
    let usd=gasPrice*xdcPrice*wei;
    return usd;

    
  };

}

let usdPrice = async () =>{
  return await fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=XDC&CMC_PRO_API_KEY=cb190bb3-b61a-4d83-8559-374edbfb27b3"
)
    .then((response) => response.json())
    .then((data) => {console.log(data.data.XDC.quote.USD.price,"1111");
    return data.data.XDC.quote.USD.price
  })
    .catch((err) => console.log(err));


}