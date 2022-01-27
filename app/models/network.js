let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const NetworkSchema = new Schema({
  networkName: { type: String, default: "" },
  newRpcUrl: { type: String, default: "" },
  chainId: { type: String, default: "" },
  currencySymbol: { type: String, default: "" },
  blockExplorer: { type: String, default: "" },
  modifiedOn: { type: Number, default: Date.now() },
  createdOn: { type: Number, default: Date.now() },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

NetworkSchema.method({
  saveData: async function () {
    return await this.save();
  },
});

NetworkSchema.static({
  getTransaction: function (findQuery) {
    return this.findOne(findQuery);
  },
  updateTransaction: function (findObj, updateObj) {
    return this.findOneAndUpdate(findObj, updateObj, {
      returnNewDocument: true,
    });
  },
  updateManyTransactions: function (findObj, updateObj) {
    return this.updateMany(findObj, updateObj);
  },
  getNetworksList: function (findObj, selectionKey = "", skip = 0, limit = 0, sort = 1) {
    return this.find(findObj, selectionKey).skip(skip).limit(limit).sort(sort);
  },
  bulkUpsert: function (bulkOps) {
    return this.bulkWrite(bulkOps);
  },
  countData: function (findObj) {
    return this.count(findObj);
  },
});
module.exports = mongoose.model("xin-network", NetworkSchema);
