import Utils from '../app/utils'
import * as yup from 'yup'

module.exports = {
  addContract: async (req, res, next) => {
    const schema = yup.object().shape({
      userId: yup.string().required(),
      contractAddress: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },
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
  checkForIdQuery: async (req, res, next) => {
    const schema = yup.object().shape({
      id: yup.string().required(),
    })
    await validate(schema, req.query, res, next)
  },
  checkAddress: async (req, res, next) => {
    const schema = yup.object().shape({
      contractAddress: yup.string().required(),
    })
    await validate(schema, req.query, res, next)
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
