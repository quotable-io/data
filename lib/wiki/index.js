const { findAuthorByName } = require('./findAuthorByName')
const { extractAuthorDetails } = require('./extractAuthorDetails')
const { getImageInfo } = require('./getImageInfo')
const { api } = require('./api')

exports.wiki = { api, findAuthorByName, extractAuthorDetails, getImageInfo }
