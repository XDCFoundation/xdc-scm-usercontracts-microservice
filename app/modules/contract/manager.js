import ContractModel from "../../models/contract";
import Utils from "../../utils";
import { httpConstants , apiFailureMessage } from "../../common/constants";
let ERC20ABI = require("./jsonInterface").ERC20ABI;
import QueueController from "../queue";
import XdcService from "../../service/xdcService";

export default class Manger {
  addContract = async ({contractAddress, userId}) => {
    const isContractExist = await ContractModel.getAccount({address: contractAddress, userId: userId});
    if (isContractExist)
      return Utils.returnRejection("Contract already exists!", httpConstants.RESPONSE_CODES.BAD_REQUEST)

    const contractDetails = await XdcService.getContractDetails(contractAddress)
    if (!contractDetails)
      return Utils.returnRejection("No contract found", httpConstants.RESPONSE_CODES.BAD_REQUEST)
    delete contractDetails._id

    const contractObject = new ContractModel({...contractDetails, userId})
    contractObject["contractName"]=contractObject && contractObject.tokenName
    contractObject["addedOn"] = Date.now();
    await contractObject.save();

    new QueueController().insertInQueue({contractAddress, userId}, "CONTRACT_ADDED")
    return contractObject;
  }

  checkAddress = async ({ contractAddress }) => {
    const contractDetails = await XdcService.getContractDetails(contractAddress)
    if (!contractDetails)
      return Utils.returnRejection("No contract found", httpConstants.RESPONSE_CODES.BAD_REQUEST)
    return contractDetails;
  };

  checkVerifyContract =   async ({ contractAddress }) => {
    const contractDetails = await XdcService.getContractDetails(contractAddress)
    if (!contractDetails || !contractDetails.sourceCode || !contractDetails.abi || !contractDetails.compilerVersion)
      return Utils.returnRejection("Contract Not Verified", httpConstants.RESPONSE_CODES.BAD_REQUEST)
      const updateObject = {
        sourceCode : contractDetails.sourceCode,
        abi : contractDetails.abi,
        compilerVersion : contractDetails.compilerVersion,
        status :  contractDetails.status,
      }
     return await ContractModel.updateManyAccounts({address : contractAddress} , updateObject); 
  };

  addTagToContract = async ({ contractId, tags , userId }) => {
    let findTag = await ContractModel.findOne({userId : userId , "tags.name" : { $in : tags}} , {tags:1});
    findTag=JSON.stringify(findTag)
    findTag=JSON.parse(findTag)
    let contract = await ContractModel.findOne({ _id: contractId});
    let contractTags = [];
    if (contract.tags && contract.tags.length && contract.tags.length > 0)
      contractTags = contract.tags.map(({name}) => name);
      contractTags = new Set(contractTags);
      contractTags= Array.from(contractTags);
    let newTags=[];  
    tags.forEach((tag) => {
      if (!contractTags.includes(tag)) 
    { 
       if(findTag)
      {
        findTag = findTag.tags.find((filterTag)=>{ if (filterTag.name===tag) return filterTag;});
        newTags.push({name:findTag.name , _id:findTag._id});
      }
      else
      newTags.push({name:tag});
    }
    });
    const responseUpdate = await ContractModel.updateAccount(
      { _id: contractId },
      { $push: { tags: { $each: newTags } } }
    );
    return responseUpdate;
  };

  removeTagFromContract = async ({ contractId, tags }) => {
    if (!tags || !tags.length || !contractId)
      return Utils.returnRejection(
        "contractId and Tags are required",
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    let contract = await ContractModel.findOne({ _id: contractId });
    let contractTags = [];
    if (contract.tags && contract.tags.length && contract.tags.length > 0)
      contractTags = contract.tags;
      
    tags.forEach((tag) => {
      contractTags = contractTags.filter(({name}) => name !== tag);
    });
    const responseUpdate = await ContractModel.updateAccount(
      { _id: contractId },
      { tags: contractTags }
    );
    return responseUpdate;
  };

  getListOfTags = async (request) => {
    if(request.userId)
      return await ContractModel.distinct("tags",{userId:request.userId});
    return await ContractModel.distinct("tags");
  };

  getContractByToken = async (param) => {
    const contract = new web3.eth.Contract(ERC20ABI, param.contract);
    const call = await web3.eth.call({
      to: param.contract,
      data: web3.utils.sha3("totalSupply()"),
    });
    let isTokenContract = true;
    const contractDB = {
      address: param.contract,
      tokenName: "",
      symbol: "",
      decimals: 0,
      totalSupply: 0,
      network: param.network,
      networkName: param.networkName
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
        return Utils.returnRejection(
          error,
          httpConstants.RESPONSE_CODES.SERVER_ERROR
        );
      }
    }
    contractDB.byteCode = await web3.eth.getCode(param.contract);
    return contractDB;
  };

  getContractById = async ({ id }) => {
    const response = await ContractModel.getAccount({ _id: id });
    if (response.address) return response;
    return Utils.returnRejection(
      apiFailureMessage.INVALID_ID,
      httpConstants.RESPONSE_CODES.NOT_FOUND
    );
  };

  updateContract = async ({contractAddress}) => {
    const isContractExist = await ContractModel.getAccount({address: contractAddress});
    if (!isContractExist)
      return Utils.returnRejection("Contract does not exists!", httpConstants.RESPONSE_CODES.BAD_REQUEST)

    const contractDetails = await XdcService.getContractDetails(contractAddress)
    if (!contractDetails)
      return Utils.returnRejection("No contract found", httpConstants.RESPONSE_CODES.BAD_REQUEST)

    const updateObject = {
      sourceCode : contractDetails.sourceCode,
      abi : contractDetails.abi,
      compilerVersion : contractDetails.compilerVersion,
      status :  contractDetails.status,
    }
    return await ContractModel.updateManyAccounts({address : contractAddress} , updateObject); 
  };

  getContractByAddress= async (params , req) => {
    const response = await ContractModel.getAccount({ address: params.address , userId:req.userId});
    if (response.address) return response;
    return Utils.returnRejection(
      apiFailureMessage.INVALID_ADDRESS,
      httpConstants.RESPONSE_CODES.NOT_FOUND
    );
  };
  renameContract = async ({ id, contractName }) => {
    let response = await ContractModel.findOne({ _id: id });
    if (!response)
      return Utils.returnRejection(
        apiFailureMessage.INVALID_ID,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    const responseUpdate = await ContractModel.updateAccount(
      { _id: id },
      { contractName: contractName }
    );
    return responseUpdate;
  };

  hideContract = async ({ id }) => {
    let responseGet = await ContractModel.getAccount({ _id: id });
    if (responseGet && responseGet.isHidden === false) {
      const responseUpdate = await ContractModel.updateAccount(
        { _id: id },
        { isHidden: true }
      );
      if (responseUpdate.isHidden === true) return responseUpdate;
      else
        return Utils.returnRejection(
          "Update Failed",
          httpConstants.RESPONSE_CODES.NOT_FOUND
        );
    }
    if (responseGet && responseGet.isHidden === true)
      return Utils.returnRejection(
        "Already hidden",
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    return Utils.returnRejection(
      apiFailureMessage.INVALID_ID,
      httpConstants.RESPONSE_CODES.NOT_FOUND
    );
  };

  showContract = async ({ id }) => {
    let responseGet = await ContractModel.getAccount({ _id: id });
    if (responseGet && responseGet.isHidden === true) {
      const responseUpdate = await ContractModel.updateAccount(
        { _id: id },
        { isHidden: false }
      );
      if (responseUpdate.isHidden === false) return responseUpdate;
      else
        return Utils.returnRejection(
          "Update Failed",
          httpConstants.RESPONSE_CODES.NOT_FOUND
        );
    }
    if (responseGet && responseGet.isHidden === false)
      return Utils.returnRejection(
        "Already not hidden",
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    return Utils.returnRejection(
      apiFailureMessage.INVALID_ID,
      httpConstants.RESPONSE_CODES.NOT_FOUND
    );
  };

  removeContract = async ({ id }) => {
    const response = await ContractModel.removeData({ _id: id });
    if (response.deletedCount === 1) return "Remove Success";
    return Utils.returnRejection(
      apiFailureMessage.INVALID_ID,
      httpConstants.RESPONSE_CODES.NOT_FOUND
    );
  };

  getContractsList = async (requestData) => {
    if (!requestData.userId || requestData.userId === "")
      return Utils.returnRejection(
        apiFailureMessage.USER_ID_MISSING,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );

    if (!requestData) requestData = {};
    const contractListRequest = this.parseGetContractListRequest(requestData);
    const contractList = await ContractModel.getAccountList(
      contractListRequest.requestData,
      contractListRequest.selectionKeys,
      contractListRequest.skip,
      contractListRequest.limit,
      contractListRequest.sortingKey
    );
    let totalCount = await ContractModel.countData();
    return { contractList, totalCount };
  };

  getSCMContracts = async ({contracts}) => {
    let SCMContracts = await ContractModel.getContracts({address: {$in: contracts}}, "address ")
    SCMContracts = SCMContracts.map(contracts => contracts.address)
    return SCMContracts;
  };
  getAlertContracts = async ({contracts}) => {
    return await ContractModel.getContracts({address: {$in: contracts} , isDeleted: false},{address:1,tags:1});
  };
  parseGetContractListRequest = (requestObj) => {
    if (!requestObj) return {};
    let skip = 0;
    if (requestObj.skip || requestObj.skip === 0) {
      skip = requestObj.skip;
      delete requestObj.skip;
    }
    let limit = 0;
    if (requestObj.limit) {
      limit = requestObj.limit;
      delete requestObj.limit;
    }
    let sortingKey = "";
    if (requestObj.sortingKey) {
      sortingKey = requestObj.sortingKey;
      delete requestObj.sortingKey;
    }
    let selectionKeys = "";
    if (requestObj.selectionKeys) {
      selectionKeys = requestObj.selectionKeys;
      delete requestObj.selectionKeys;
    }
    let searchQuery = [];
    if (
      requestObj.searchKeys &&
      requestObj.searchValue &&
      Array.isArray(requestObj.searchKeys) &&
      requestObj.searchKeys.length
    ) {
      requestObj.searchKeys.map((searchKey) => {
        let searchRegex = { $regex: requestObj.searchValue, $options: "i" };
        searchQuery.push({ [searchKey]: searchRegex });
      });
      requestObj["$or"] = searchQuery;
    }
    if (requestObj.searchKeys) delete requestObj.searchKeys;
    if (requestObj.searchValue) delete requestObj.searchValue;
    return {
      requestData: requestObj,
      skip: skip,
      limit: limit,
      sortingKey: sortingKey,
      selectionKeys: selectionKeys,
    };
  };
}
