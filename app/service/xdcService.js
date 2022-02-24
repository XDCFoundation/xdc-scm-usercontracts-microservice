import {httpConstants} from "../common/constants";
import HTTPService from "./http-service";
import Config from "../../config"


export default class XdcService {
    static async getContractDetails(contractAddress) {
        const contractResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getContractDetailsUsingAddress/${contractAddress}`, {},)
        return !contractResponse || !contractResponse.success || !contractResponse.responseData || !Object.keys(contractResponse.responseData).length ? null : {
            ...contractResponse.responseData.contractResponse,
            status: contractResponse.responseData.contractStatus,
            network: "XDC Mainnet"
        };
    }
}
