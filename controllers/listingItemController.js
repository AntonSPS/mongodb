ListingItem = require('../models/listingItemModel');

const {publishToQueue} = require('../services/rabbitmq.js');

exports.new = async function (req, res) {
    let listingItem = new ListingItem(
        req.body.itemId,
        req.body.city,
        req.body.address,
        req.body.rooms,
        req.body.floor,
        req.body.price,
        req.body.phone,
        req.body.email,
        req.body.description
    );
    
    if(typeof listingItem.itemId !== 'undefined' && listingItem.itemId) {
        //add to Rabbit
        let {queueName, payload} = req.body;
        await publishToQueue(queueName,payload);
        console.log(listingItem);
        res.json({
            status: 'success',
            message: 'New item created!',
            data: listingItem
        });
    } else {
        res.json({
            status: 'failed',
            message: 'Id is empty'
        })
    }
    
};
