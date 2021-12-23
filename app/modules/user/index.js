import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class Index {
  async getUserDetails (request, response) {
    lhtWebLog('Inside getUserDetails', request.query, 'getUserDetails', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().getUserDetails(request.query))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
  async addUser (request, response) {
    lhtWebLog('Inside addUser', request.body, 'addUser', 0, '')
    const [error, getMetersRes] = await Utils.parseResponse(new BLManager().addUser(request.body))
    if (!getMetersRes) { return Utils.handleError(error, request, response) }
    return Utils.response(response, getMetersRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
  }
}
