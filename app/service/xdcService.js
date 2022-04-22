import {httpConstants} from "../common/constants";
import HTTPService from "./http-service";
import Config from "../../config"


export default class XdcService {
    static async getContractDetails(contractAddress) {
        const contractResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.GET, Config.XDC_MAIN_NET_BASE_URL, `getContractDetailsUsingAddress/${contractAddress}`, {},
       { "X-API-key": Config.OBSERVER_X_API_KEY})
        return !contractResponse || !contractResponse.success || !contractResponse.responseData || !Object.keys(contractResponse.responseData).length ? null : {
            ...contractResponse.responseData.contractResponse,
            status: contractResponse.responseData.contractStatus,
            network: "XDC Mainnet"
        };
    }

    static async getContracts(requestData) {
        const contractResponse = await HTTPService.executeHTTPRequest(httpConstants.METHOD_TYPE.POST, Config.OBSERVER_CONTRACTS, `get-contracts`, requestData,{})
        return !contractResponse || !contractResponse.success || !contractResponse.responseData || !Object.keys(contractResponse.responseData).length ? null : {
            ...contractResponse.responseData
        };
    }
}
