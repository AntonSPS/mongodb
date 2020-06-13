var amqp = require('amqplib');
var protobuf = require("protobufjs");
const ListingItemModel = require('./models/listingItemModel');
const config = require('./env.config.js');

amqp.connect(config.rabbitMQEndpoint).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('request', {durable: true});

    ok = ok.then(function(_qok) {
      return ch.consume('request', function(msg) {
        protobuf.load(config.protoPath)
        .then(function(root) {
          var ListingMessage = root.lookupType("Listing");
          var message = ListingMessage.decode(msg.content);
          let payload = message.toJSON();
          console.log(" [x] Received '%s'", payload);
          console.log("Saving to db");
          ListingItemModel.createItem(payload)
          .then((result) => {
              console.log(result);
          });
        }).catch(err => console.log(err));
        
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).catch(console.warn);


