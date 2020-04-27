const fs = require('fs')
const path = require('path')
const middy = require('middy')
const { jsonBodyParser, httpErrorHandler } = require('middy/middlewares')

const { AmpCacheService, SignatureService } = require('./services')
const { response } = require('./utils/response')

const clearCacheHandler = async event => {
  if (!event.body ) {
    return response(400, {
      error: true,
      message: 'Body not found on your request'
    })
  }

  const { urls } = event.body
  if (!urls) {
    return response(400, {
      error: true,
      message: 'The path "urls" not found or is empty in your body request'
    })
  }

  if (!Array.isArray(urls)) {
    return response(400, {
      error: true,
      message: 'The path "urls" not is array'
    })
  }

  try {
    const privateKey = fs.readFileSync(path.join(__dirname, 'assets/private-key.pem'), 'utf-8')

    if (!privateKey) {
      throw Error('ERROR on load your private key.\nPrivate Key not found.')
    }

    const cdnCachesEndpoint = process.env.CDN_CACHES_ENDPOINT
    if (!cdnCachesEndpoint) {
      throw Error('ERROR.\nNot found CDN_CACHES_ENDPOINT on your environment.')
    }

    const siteDomain = process.env.SITE_DOMAIN
    if (!cdnCachesEndpoint) {
      throw Error('ERROR.\nNot found SITE_DOMAIN on your environment.')
    }

    const signatureInstance = new SignatureService(privateKey)
    const ampCacheInstance = new AmpCacheService(siteDomain, signatureInstance, cdnCachesEndpoint)

    await ampCacheInstance.init()
    await ampCacheInstance.clearCache(urls)

    return response(200, {
      message: 'Success'
    })
  } catch (error) {
    return response(500, {
      message: error
    })
  }
}

const clearCache = middy(clearCacheHandler)
  .use(jsonBodyParser())
  .use(httpErrorHandler())

module.exports = { 
  clearCache,
}
