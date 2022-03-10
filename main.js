const crypto = require('crypto');

const settings = {
  algorithm: '',
  encoding: '',
};

function encode(content) {
  const hash = crypto.createHash(settings.algorithm);
  hash.update(content, 'utf8');
  return hash.digest(settings.encoding);
}

module.exports.templateTags = [{
  name: 'hashrequestbody',
  displayName: 'Hash-Request-Body',
  description: 'Creates a hash of the request body',
  args: [
    {
      displayName: 'Algorithm',
      type: 'enum',
      options: [
        { displayName: 'MD5', value: 'md5' },
        { displayName: 'SHA1', value: 'sha1' },
        { displayName: 'SHA256', value: 'sha256' },
        { displayName: 'SHA512', value: 'sha512' }
      ]
    },
    {
      displayName: 'Digest Encoding',
      description: 'The encoding of the output',
      type: 'enum',
      options: [
        { displayName: 'Hexadecimal', value: 'hex' },
        { displayName: 'Base64', value: 'base64' }
      ]
    }
  ],
  async run(context, algorithm ='', encoding = '') {
    settings.algorithm = algorithm
    settings.encoding = encoding

    let request = await context.util.models.request.getById(context.meta.requestId);
    return encode(request.body.text);
  }
}];
