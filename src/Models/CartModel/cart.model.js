import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "items",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Cart = mongoose.models.carts || mongoose.model("carts", cartSchema);
export default Cart;
