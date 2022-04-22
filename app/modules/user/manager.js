import UserModel from "../../models/user";
import Utils from "../../utils";
import { httpConstants } from "../../common/constants";
import Config from '../../../config';
import JWTService from "../../service/jwt";

export default class Manger {
  getUserDetails = async ({ accountAddress }) => {
    if (!accountAddress)
      return Utils.returnRejection(
        "userId is required",
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    const response = await UserModel.findOne({ accountAddress: accountAddress });
    if (response && response.accountAddress) return response;
    else return "User does not exist";
  };

  addUser = async ({ accountAddress }) => {
    // const userDB = await this.checkAddress({ contractAddress });
    let response;
    try {
    response = await this.getUserDetails({ accountAddress });
    if (response.accountAddress) {
        if(response.sessionToken){
          let decoded = JWTService.decodeJWT(response.sessionToken)
          if (!decoded) {
            let sessionToken = JWTService.generateSessionToken({accountAddress : accountAddress})
            response = await UserModel.updateUser({accountAddress : accountAddress} , {sessionToken:sessionToken})
          }
        }
        return response;
    }
    const userObject = new UserModel({accountAddress : accountAddress});
    let sessionToken = JWTService.generateSessionToken({accountAddress : accountAddress})
    userObject["sessionToken"] = sessionToken;
    return await userObject.save();
  } catch (error) {
    throw error;
  }
  };

  generateSessionToken = (accountAddress) =>{
   return jwt.sign({accountAddress : accountAddress}, Config.JWT_KEY, {
      algorithm: "HS256",
      expiresIn: typeof Config.JWT_EXPIRY_SECONDS === 'string' ? parseInt(Config.JWT_EXPIRY_SECONDS): Config.JWT_EXPIRY_SECONDS,
    })
  }
}
