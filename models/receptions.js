const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

let receptionSchema = new Schema({
  IdBusiness: {
    type: String
  },
  DocumentNumber: {
    type: String
  },
  UUID: {
    type: String
  },
  IssueDateTime: {
    type: String
  },
  LineExtensionAmount: {
    type: String
  },
  TaxExclusiveAmount: {
    type: String
  },
  PayableAmount: {
    type: String
  },
  ReceptionDate: {
    type: String
  },
  JSON: {
    type: String
  },
  Status: {
    type: String
  },
  StatusFinally: {
    type: String,
    default: null
  },
  Comment: {
    type: String
  },
  CustomerID: {
    type: String
  },
  CustomerName: {
    type: String
  },
  ProviderID: {
    type: String
  },
  ProviderName: {
    type: String
  },
  TypeDocument: {
    type: String
  },
  Send: {
    type: String
  },
  Reception: {
    type: String
  },
  User: {
    type: String
  },
  DocumentUId: {
    type: String,
    unique: true
  }
})

receptionSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('reception', receptionSchema)
