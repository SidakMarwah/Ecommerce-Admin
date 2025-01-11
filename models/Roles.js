import mongoose, { model, models, Schema } from "mongoose";

const RolesSchema = new Schema({
    email: { type: String, required: true },
    role: { type: String, required: true }
});

const Roles = models.Roles || model('Roles', RolesSchema);

export default Roles;