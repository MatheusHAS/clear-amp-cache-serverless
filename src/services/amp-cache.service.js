const axios = require('axios')

class AmpCacheService {
  /**
   * 
   * @param {string} siteUrl is common website url, example: www.mysite.com.br without https://
   * @param {SignatureService} signServiceInstance instance of SignatureService
   * @param {string} cdnCachesUrl is google URL to get caches endpoints. 
   * @param {string} protocol of your website. Default: 'https'
   */
  constructor(siteDomain, signatureServiceInstance, cdnCachesUrl, protocol = 'https') {
    this.cdnCachesUrl = cdnCachesUrl
    this.unixTimestamp = Math.floor(new Date() / 1000)
    this.ampCdnLocations = []
    this.protocol = protocol
    this.siteDomain = siteDomain
    this.signatureInstance = signatureServiceInstance
  }

  /**
   * initialize and get cdn caches options
   */
  async init() {
    return await axios.get(this.cdnCachesUrl).then(response => {
      this.ampCdnLocations = response.data
    }).catch(error => {
      throw Error(`[AmpCacheService.init] ERROR => ${JSON.stringify(error.response, null, 2)}`)
    })
  }

  getUpdateCache(currentPath) {
    const url = `/update-cache/c/s/${this.siteDomain}${currentPath}?amp_action=flush&amp_ts=${this.unixTimestamp}`
    const signedContent = this.signatureInstance.signIn({
      content: url,
    })
    return {
      url,
      signedContent,
    }
  }

  /**
   * Send array of paths to clear cache of amp CDNs
   * @param {array} urlsPath 
   */
  async clearCache(urlsPath = []) {
    for (const currentPath of urlsPath) {
      let result = []
      const updateCache = this.getUpdateCache(currentPath)
      console.log(`=> Flushing cache to: ${currentPath}`)

      for (const location of this.ampCdnLocations.caches) {
        const { updateCacheApiDomainSuffix, id } = location
        const ampCdnBaseUrl = `${this.protocol}://${this.siteDomain.replace(/\./g, '-')}.${updateCacheApiDomainSuffix}`
        
        const urlToFlushCache = `${ampCdnBaseUrl}${updateCache.url}&amp_url_signature=${updateCache.signedContent}`
        await axios({
          method: 'GET',
          url: urlToFlushCache,
        }).then(() => {
          result.push(`${id.toUpperCase()} => success`)
        }).catch(error => {
          result.push(`${id.toUpperCase()} => fail [${error.code}]`)
        })
      }
      result.forEach(message => console.log(message))
      console.log('----')
    }
    console.log('When occurs ENOTFOUND error, possible your page is not found or not has indexed in this cdn. it\'s pretty common :)')
  }
}

module.exports = AmpCacheService
module.exports.AmpCacheService = AmpCacheService
