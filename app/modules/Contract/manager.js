import ContractModel from "../../models/Contract"
import Utils from '../../utils'
import {httpConstants} from "../../common/constants";


let ERC20ABI = require("./jsonInterface").ERC20ABI;

export default class Manger {
    addContract = async ({contractAddress}) => {
        if (!contractAddress)
            return Utils.returnRejection("contract address is required", httpConstants.RESPONSE_CODES.BAD_REQUEST)
        const response = await ContractModel.find({address: contractAddress})
        if (response[0] && response[0].address && response[0].address === contractAddress)
            return Utils.returnRejection("Address already Exists", httpConstants.RESPONSE_CODES.BAD_REQUEST)
        const contractDB = await this.getContractByToken(contractAddress)
        return this.saveContractToDB(contractDB);
    }

    saveContractToDB = async (contractDB) => {
        const contractObject = new ContractModel(contractDB)
        return await contractObject.save();
    }

    checkAddress = async ({contractAddress}) => {
        return this.addContract({contractAddress})
    }

    addTagToContract = async ({ contractId, tags }) => {
        let contract = await ContractModel.findOne({ _id: contractId });
        let contractTags = [];
        if (contract.tags && contract.tags.length && contract.tags.length > 0)
            contractTags = contract.tags;
        tags.forEach((tag) => {
            if (!contractTags.includes(tag))
                contractTags.push(tag);
        })
        const responseUpdate = await ContractModel.updateAccount({ _id: contractId }, { tags: contractTags });
        return responseUpdate;
    }

    removeTagFromContract = async ({ contractId, tags }) => {
        if (!tags || !tags.length || !contractId)
            return Utils.returnRejection("contractId and Tags are required", httpConstants.RESPONSE_CODES.BAD_REQUEST)
        let contract = await ContractModel.findOne({ _id: contractId });
        let contractTags = [];
        if (contract.tags && contract.tags.length && contract.tags.length > 0)
            contractTags = contract.tags;
        tags.forEach((tag) => {
            contractTags = contractTags.filter(e => e !== tag);
        })
        const responseUpdate = await ContractModel.updateAccount({ _id: contractId }, { tags: contractTags });
        return responseUpdate;
    }

    getListOfTags = async () => {
        return await ContractModel.distinct("tags");
    }

    getContractByToken = async (contractAddress) => {
        const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
        const call = await web3.eth.call({to: contractAddress, data: web3.utils.sha3("totalSupply()")});
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
        } else {
            try {
                contractDB.tokenName = await contract.methods.name().call();
                contractDB.symbol = await contract.methods.symbol().call();
                contractDB.decimals = await contract.methods.decimals().call();
                contractDB.totalSupply = await contract.methods.totalSupply().call();
                contractDB.ERC = 2;
            } catch (error) {
                return Utils.returnRejection(error, httpConstants.RESPONSE_CODES.SERVER_ERROR)
            }
        }
        contractDB.byteCode = await web3.eth.getCode(contractAddress);
        return contractDB

    }

    getContractById = async ({ id }) => {
        const response = await ContractModel.getAccount({ _id: id });
        if (response.address)
            return response;
        return Utils.returnRejection(apiFailureMessage.INVALID_ID , httpConstants.RESPONSE_CODES.NOT_FOUND);
    }

    renameContract = async ({ id, contractName }) => {
        let response = await ContractModel.findOne({ _id: id });
        if (!response)
            return Utils.returnRejection(apiFailureMessage.INVALID_ID, httpConstants.RESPONSE_CODES.BAD_REQUEST);
        const responseUpdate = await ContractModel.updateAccount({ _id: id }, { contractName: contractName });
        return responseUpdate;
    }

    hideContract = async ({ id }) => {
        let responseGet = await ContractModel.getAccount({ _id: id });
        if (responseGet && responseGet.isHidden === false) {
            const responseUpdate = await ContractModel.updateAccount({ _id: id }, { isHidden: true });
            if (responseUpdate.isHidden === true)
                return responseUpdate;
            else
                return Utils.returnRejection("Update Failed", httpConstants.RESPONSE_CODES.NOT_FOUND);
        }
        if (responseGet && responseGet.isHidden === true)
            return Utils.returnRejection("Already hidden", httpConstants.RESPONSE_CODES.BAD_REQUEST);
        return Utils.returnRejection(apiFailureMessage.INVALID_ID, httpConstants.RESPONSE_CODES.NOT_FOUND);
    }

    showContract = async ({ id }) => {
        let responseGet = await ContractModel.getAccount({ _id: id });
        if (responseGet && responseGet.isHidden === true) {
            const responseUpdate = await ContractModel.updateAccount({ _id: id }, { isHidden: false });
            if (responseUpdate.isHidden === false)
                return responseUpdate;
            else
                return Utils.returnRejection("Update Failed", httpConstants.RESPONSE_CODES.NOT_FOUND);
        }
        if (responseGet && responseGet.isHidden === false)
            return Utils.returnRejection("Already not hidden", httpConstants.RESPONSE_CODES.BAD_REQUEST);
        return Utils.returnRejection(apiFailureMessage.INVALID_ID, httpConstants.RESPONSE_CODES.NOT_FOUND);
    }

    removeContract = async ({ id }) => {
        const response = await ContractModel.removeData({ _id: id })
        if (response.deletedCount === 1)
            return "Remove Success"
        return Utils.returnRejection(apiFailureMessage.INVALID_ID, httpConstants.RESPONSE_CODES.NOT_FOUND);
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
