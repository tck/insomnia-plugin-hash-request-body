const crypto = require('crypto');

const replacementContent = 'TO BE DONE: replacementContent';
const settings = {
  algorithm: '',
  encoding: '',
};

function encode(content) {
  const hash = crypto.createHash(settings.algorithm);
  hash.update(content, 'utf8');
  return hash.digest(settings.encoding);
}

function replaceWithHMAC(content, body) {
  return content.replace(new RegExp(replacementContent, 'g'), encode(body))
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

    return replacementContent;
  }
}];

module.exports.requestHooks = [
  context => {
    if (context.request.getUrl().indexOf(replacementContent) !== -1) {
      context.request.setUrl(replaceWithHMAC(context.request.getUrl(), context.request.getBodyText()));
    }
    if (context.request.getBodyText().indexOf(replacementContent) !== -1) {
      context.request.setBodyText(replaceWithHMAC(context.request.getBodyText(), context.request.getBodyText()));
    }
    context.request.getHeaders().forEach(h => {
      if (h.value.indexOf(replacementContent) !== -1) {
        context.request.setHeader(h.name, replaceWithHMAC(h.value, context.request.getBodyText()));
      }
    });
    context.request.getParameters().forEach(p => {
      if (p.value.indexOf(replacementContent) !== -1) {
        context.request.setParameter(p.name, replaceWithHMAC(p.value, context.request.getBodyText()));
      }
    });
  }
];
