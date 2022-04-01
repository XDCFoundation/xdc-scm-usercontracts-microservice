import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
  async addContract (request, response) {
    lhtWebLog('Inside addContract', request.body, 'addContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().addContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async getContractById (request, response) {
    lhtWebLog('Inside getContractById', request.query, 'getContractById', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getContractById(request.query))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async updateContract (request, response) {
    lhtWebLog('Inside updateContract', request.body, 'updateContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().updateContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
 
  async getContractByAddress (request, response) {
    lhtWebLog('Inside getContractByAddress', request.query, 'getContractByAddress', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getContractByAddress(request.params , request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async getContractsList (request, response) {
    lhtWebLog('Inside getContractsList', request.body, 'getContractsList', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getContractsList(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async getSCMContracts (request, response) {
    lhtWebLog('Inside getSCMContracts', request.body, 'getSCMContracts', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getSCMContracts(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async getAlertContracts (request, response) {
  lhtWebLog('Inside getAlertContracts', request.body, 'getAlertContracts', 0, '')
  const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getAlertContracts(request.body))
  if (!getMetersRes) { return Utils.handleError(error, request, response) }
  return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async hideContract (request, response) {
    lhtWebLog('Inside hideContract', request.body, 'hideContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().hideContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }

  async showContract (request, response) {
    lhtWebLog('Inside showContract', request.body, 'showContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().showContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async removeContract (request, response) {
    lhtWebLog('Inside removeContract', request.body, 'removeContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().removeContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async addTagToContract (request, response) {
    lhtWebLog('Inside addTagToContract', request.body, 'addTagToContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().addTagToContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async removeTagFromContract (request, response) {
    lhtWebLog('Inside removeTagFromContract', request.body, 'removeTagFromContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().removeTagFromContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async getListOfTags (request, response) {
    lhtWebLog('Inside getListOfTags', request.body, 'getListOfTags', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getListOfTags(request.query))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async renameContract (request, response) {
    lhtWebLog('Inside renameContract', request.body, 'renameContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().renameContract(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async checkAddress (request, response) {
    lhtWebLog('Inside checkAddress', request.query, 'checkAddress', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().checkAddress(request.query))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async checkVerifyContract  (request, response) {
    lhtWebLog('Inside checkVerifyContract', request.query, 'checkVerifyContract', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().checkVerifyContract(request.query))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
}
