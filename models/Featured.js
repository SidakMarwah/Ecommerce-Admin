import mongoose, { model, models, Schema } from "mongoose";

const FeaturedProductSchema = new Schema({
    product: { type: mongoose.Types.ObjectId, ref: 'Product' }
});

const Featured = models.Featured || model('Featured', FeaturedProductSchema);

export default Featured;