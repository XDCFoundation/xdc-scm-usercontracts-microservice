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

  async getContractsList (request, response) {
    lhtWebLog('Inside getContractsList', request.body, 'getContractsList', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getContractsList(request.body))
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
}
