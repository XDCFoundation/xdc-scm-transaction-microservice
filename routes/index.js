/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import { stringConstants } from "../app/common/constants";
import TransactionModule from "../app/modules/transaction";
import NetworkModule from "../app/modules/network/index";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import { authenticate } from "../middleware/authentication";

module.exports = (app) => {
  app.get("/", (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

  /**
  * create swagger UI
  * **/
  app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.post("/transaction", new TransactionModule().addTransaction);
  app.post("/get-transaction-list", authenticate, new TransactionModule().getTransactionList);
  app.post("/get-transaction", authenticate, ValidationManger.validateTransactionHash, new TransactionModule().getTransactionByHash);
  app.post("/get-transaction-analytics", authenticate, ValidationManger.validateAnalyticsRequest, new TransactionModule().getTransactionAnalytics);
  app.post("/get-gas-used-analytics", authenticate, ValidationManger.validateAnalyticsRequest, new TransactionModule().getGasUsedAnalytics);
  app.post("/get-active-users-analytics", authenticate, ValidationManger.validateAnalyticsRequest, new TransactionModule().getActiveUsersAnalytics);
  app.post("/get-top-callers", authenticate, ValidationManger.validateAnalyticsRequest, new TransactionModule().getTopCallers);
  app.post("/get-top-function-calls", authenticate, ValidationManger.validateAnalyticsRequest, new TransactionModule().getTopFunctionCalls);
  app.post("/get-gasprice-in-USD", new TransactionModule().getTGasPriceInUSD);


  //networks route
  app.post("/add-network", new NetworkModule().addNetwork);
  app.post("/get-network", new NetworkModule().getNetworksList);

  /**
   * route definition
   */
};
