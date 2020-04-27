const crypto = require('crypto')

class SignatureService {
  /**
   * Create instance to sign content
   * @param {string} privateKey is your private key content 
   */
  constructor(privateKey) {
    this.privateKey = privateKey
  }

  /**
   * Return signature on base64
   * @param {String} content you need to sign
   */
  signIn({ content }) {
    this.instance = crypto.createSign('RSA-SHA256')
    this.instance.update(content)
    this.instance.end()

    const signature = this.instance.sign({
      key: this.privateKey,
    })
    const _signatureBuffer = Buffer.from(signature, 'utf-8')
    let signatureBase64 = _signatureBuffer.toString('base64')
    signatureBase64 = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    return signatureBase64
  }
}

module.exports = SignatureService
module.exports.SignatureService = SignatureService
