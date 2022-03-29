import { httpConstants , apiFailureMessage} from "../app/common/constants";
import JWTService from "../app/service/jwt";
import Utility from "../app/utils";

const authenticate = async (req, res, next) => {

    const bearerToken = req.headers['authorization'];
    if (!bearerToken) 
        return Utility.handleError(
            { message: apiFailureMessage.MISSING_TOKEN, code: httpConstants.RESPONSE_CODES.FORBIDDEN },
            req,
            res
          );    
     const token = bearerToken.split(" ");
          if (token.length < 2) {
            return Utility.handleError(
              { message: apiFailureMessage.MISSING_TOKEN, code: httpConstants.RESPONSE_CODES.FORBIDDEN },
              req,
              res
            );
          }      
    let decoded = JWTService.decodeJWT(token[1])
    if (!decoded) {
        return Utility.handleError(
            { message: apiFailureMessage.INVALID_SESSION_TOKEN, code: httpConstants.RESPONSE_CODES.FORBIDDEN },
            req,
            res
          );
    }
    next();
}

module.exports = {
    authenticate
}