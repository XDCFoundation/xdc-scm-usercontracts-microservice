import ContractModel from "../../models/Contract"
import Utils from '../../utils'
import { httpConstants, apiFailureMessage, apiSuccessMessage } from "../../common/constants";


let ERC20ABI = require("./jsonInterface").ERC20ABI;

export default class Manger {
    addContract = async ({ contractAddress }) => {
        if (!contractAddress)
            return Utils.returnRejection("contract address is required", httpConstants.RESPONSE_CODES.BAD_REQUEST)
        const response = await ContractModel.find({ address: contractAddress })
        if (response[0] && response[0].address && response[0].address === contractAddress)
            return Utils.returnRejection("Address already Exists", httpConstants.RESPONSE_CODES.BAD_REQUEST)
        const token = new web3.eth.Contract(ERC20ABI, contractAddress);
        const call = await web3.eth.call({ to: contractAddress, data: web3.utils.sha3("totalSupply()") });
        console.log("Call IS", call)
        let isTokenContract = true
        const contractDB = {
            address: contractAddress,
            tokenName: "",
            symbol: "",
            decimals: 0,
            totalSupply: 0
        };
        if (call === "0x") {
            isTokenContract = false;
            contractDB.ERC = 0;
        }
        else {
            try {
                contractDB.tokenName = await token.methods.name().call();
                contractDB.symbol = await token.methods.symbol().call();
                contractDB.decimals = await token.methods.decimals().call();
                contractDB.totalSupply = await token.methods.totalSupply().call();
                contractDB.ERC = 2;
            } catch (error) {
                return Utils.returnRejection(error, httpConstants.RESPONSE_CODES.SERVER_ERROR)
            }
        }
        contractDB.byteCode = await web3.eth.getCode(contractAddress);
        const contractObject = new ContractModel(contractDB)
        return await contractObject.save();
    }

    getContractById = async ({ id }) => {
        if (!id)
            return Utils.returnRejection("id is required", httpConstants.RESPONSE_CODES.BAD_REQUEST);
        const response = await ContractModel.getAccountList({ _id: id });
        if (response[0].address)
            return response;
        return Utils.returnRejection("Invalid Id", httpConstants.RESPONSE_CODES.NOT_FOUND);

    }
    getContractsList = async (requestData) => {
        if (!requestData) requestData = {}
        const contractListRequest = this.parseGetContractListRequest(requestData);
        const contractList = await ContractModel.getAccountList(contractListRequest.requestData, contractListRequest.selectionKeys, contractListRequest.skip, contractListRequest.limit, contractListRequest.sortingKey);
        let totalCount = await ContractModel.countData()
        return { contractList, totalCount };
    };

    parseGetContractListRequest = (requestObj) => {
        if (!requestObj) return {};
        let skip = 0;
        if (requestObj.skip || requestObj.skip === 0) {
            skip = requestObj.skip;
            delete requestObj.skip
        }
        let limit = 0;
        if (requestObj.limit) {
            limit = requestObj.limit;
            delete requestObj.limit
        }
        let sortingKey = '';
        if (requestObj.sortingKey) {
            sortingKey = requestObj.sortingKey;
            delete requestObj.sortingKey;
        }
        let selectionKeys = '';
        if (requestObj.selectionKeys) {
            selectionKeys = requestObj.selectionKeys;
            delete requestObj.selectionKeys
        }
        let searchQuery = [];
        if (requestObj.searchKeys && requestObj.searchValue && Array.isArray(requestObj.searchKeys) && requestObj.searchKeys.length) {
            requestObj.searchKeys.map((searchKey) => {
                let searchRegex = { "$regex": requestObj.searchValue, "$options": "i" };
                searchQuery.push({ [searchKey]: searchRegex });
            });
            requestObj["$or"] = searchQuery;
        }
        if (requestObj.searchKeys)
            delete requestObj.searchKeys;
        if (requestObj.searchValue)
            delete requestObj.searchValue;
        return {
            requestData: requestObj,
            skip: skip,
            limit: limit,
            sortingKey: sortingKey,
            selectionKeys: selectionKeys
        };
    }
}
