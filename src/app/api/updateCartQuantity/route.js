// route.js inside /api/updateCartQuantity
import Cart from "../../../Models/CartModel/cart.model.js";
import { dbConnect } from "../../../dbConfig/dbConnect";

export async function PUT(req) {
  try {
    const { email, productId, quantity } = await req.json();

    await dbConnect();

    const cart = await Cart.findOne({ email });

    if (!cart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
      });
    }

    const item = cart.items.find(
      (item) => item.productId._id.toString() === productId._id
    );

    if (!item) {
      return new Response(
        JSON.stringify({ message: "Product not found in cart" }),
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await cart.save();

    return new Response(JSON.stringify({ message: "Cart updated", cart }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return new Response(JSON.stringify({ message: "Error updating cart" }), {
      status: 500,
    });
  }
}
