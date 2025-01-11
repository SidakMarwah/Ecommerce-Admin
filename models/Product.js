import mongoose, { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: [true, 'Product title is required.'] },
    description: { type: String },
    price: { type: String, required: [true, 'Product price is required.'] },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: { type: Object }
}, {
    timestamps: true,
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;