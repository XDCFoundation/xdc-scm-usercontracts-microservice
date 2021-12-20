import Utils from '../app/utils'
import * as yup from 'yup'

module.exports = {
  renameContract: async (req, res, next) => {
    const schema = yup.object().shape({
      id: yup.string().required(),
      contractName: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },
  checkForId: async (req, res, next) => {
    const schema = yup.object().shape({
      id: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  addTagToContract: async (req, res, next) => {
    const schema = yup.object().shape({
      tags: yup.array().required(),
      contractId : yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },
}

const validate = async (schema, reqData, res, next) => {
  try {
    await schema.validate(reqData, { abortEarly: false })
    next()
  } catch (e) {
    const errors = e.inner.map(({ path, message, value }) => ({ path, message, value }))
    Utils.responseForValidation(res, errors)
  }
}
