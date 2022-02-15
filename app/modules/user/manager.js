import UserModel from "../../models/user";
import Utils from "../../utils";
import { httpConstants } from "../../common/constants";

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
        return response;
    }
    const userObject = new UserModel({accountAddress : accountAddress});
    return await userObject.save();
  } catch (error) {
    throw error;
  }
  };
}
