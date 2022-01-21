/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import { stringConstants } from "../app/common/constants";
import TransactionModule from "../app/modules/transaction";
import NetworkModule from "../app/modules/network/index";
module.exports = (app) => {
  app.get("/", (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));
  app.post("/transaction", new TransactionModule().addTransaction);
  app.post("/get-transaction", new TransactionModule().getTransactionList);
  //networks route
  app.post("/add-network", new NetworkModule().addNetwork);
  app.post("/get-network", new NetworkModule().getNetworksList);

  /**
   * route definition
   */
};
