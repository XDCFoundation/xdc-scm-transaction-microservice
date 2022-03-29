import Config from "../../config"
import jwt from 'jsonwebtoken';


export default class XdcService {
    static  generateSessionToken(data) {
        return jwt.sign(data, Config.JWT_KEY, {
            algorithm: "HS256",
            expiresIn: typeof Config.JWT_EXPIRY_SECONDS === 'string' ? parseInt(Config.JWT_EXPIRY_SECONDS): Config.JWT_EXPIRY_SECONDS,
          })
    }
    static  decodeJWT(token) {
        try {
            const decoded = jwt.verify(token, Config.JWT_KEY);
            if(decoded)
                return decoded;
          } catch(err) {
            // err
                return false;
          }
    }
}

