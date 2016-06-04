var SamsungRemote = require('samsung-remote');
var references = require('./references.js');

/*

var remote = new SamsungRemote({
    ip: '192.168.1.13' // required: IP address of your Samsung Smart TV
});

remote.send('KEY_VOLUP', function callback(err) {
    if (err) {
        throw new Error(err);
    } else {
        // command has been successfully transmitted to your tv
    }
});

// check if TV is alive (ping)
remote.isAlive(function(err) {
    if (err) {
        throw new Error('TV is offline');
    } else {
        console.log('TV is ALIVE!');
    }
});

 */

function registerSamsungTvNodes(RED) {

  /* ---------------------------------------------------------------------------
   * CONFIG node
   * -------------------------------------------------------------------------*/
  function SamsungTvNodeConfig(config) {
    RED.nodes.createNode(this, config);

    // Configuration options passed by Node Red
    this.address = config.address;
    this.name = config.name;

    // Config node state
    // this.connected = false;
    // this.connecting = false;
    // this.closing = false;
    // this.subscriptions = {};
    // this.inputSocket = undefined;
    // this.devDesc = undefined;
    // this.yamaha = new YamahaAPI(this.address);

    this.remote = new SamsungRemote({ip: this.address});
    this.send = this.remote.send.bind(this.remote);
    this.isAlive = this.remote.isAlive.bind(this.remote);

    // Define functions called by nodes
    var node = this;

    // Define config node event listeners
    node.on("close", function(done){
      node.remote = null;
      done();
    });
  }
  RED.nodes.registerType("samsung-tv", SamsungTvNodeConfig);


  /* ---------------------------------------------------------------------------
   * SEND node
   * -------------------------------------------------------------------------*/
  function SamsungTvNodeSend(config) {
    RED.nodes.createNode(this, config);

    // Save settings in local node
    this.device = config.device;
    this.deviceNode = RED.nodes.getNode(this.device);
    this.name = config.name;
    this.key = config.key;

    var node = this;
    if (this.deviceNode) {

      // Input handler, called on incoming flow
      this.on('input', function(msg) {

        // If no key is given in the config, then we us the key in the msg.
        var key = (node.key) ? node.key : msg.payload;
        if (!key) {
          node.error('No key given. Specify either in the config or via msg.payload!');
          return;
        }

        // Put data to the device.
        node.deviceNode.send(String(key), function (err) {
          if (err) {
            node.error("Failed to send data to TV with error: " + err);
          }
        });
      });

    } else {
      this.error(RED._("samdung-tv.errors.missing-config"));
    }
  }
  RED.nodes.registerType("samsung-tv-send", SamsungTvNodeSend);



  /* ---------------------------------------------------------------------------
   * Backend informations
   * -------------------------------------------------------------------------*/
   references.provideReferences(RED)
}

module.exports = registerSamsungTvNodes;
