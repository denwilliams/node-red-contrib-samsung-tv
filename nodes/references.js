var keys = require('./keys');

function provideReferences(RED) {
  // Provide list of keys.
  RED.httpAdmin.get('/samsungtv/references/send', function(req, res, next){
    res.end(JSON.stringify(keys));
    return;
  });
}

module.exports.provideReferences = provideReferences;
