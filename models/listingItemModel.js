const mongoose = require('../services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const listingItemSchema = new Schema({
    itemId: String,
    city: String,
    address: String,
    rooms: Number,
    floor: Number,
    price:Number,
    phone:String,
    email:String,
    description:String
});

listingItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
listingItemSchema.set('toJSON', {
    virtuals: true
});


const ListingItem = mongoose.model('ListingItem', listingItemSchema);

exports.createItem = (itemData) => {
    console.log("DATA: ");
    console.log(itemData);
    const listingItem = new ListingItem(itemData);
    return listingItem.save();
};

