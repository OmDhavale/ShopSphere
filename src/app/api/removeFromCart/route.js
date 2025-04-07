import { dbConnect } from "../../../dbConfig/dbConnect";
import Cart from "../../../Models/CartModel/cart.model"

export async function DELETE(req) {
  try {
    const reqBody = await req.json();
    const { email, productId } = reqBody;

    if (!email || !productId) {
      return new Response(
        JSON.stringify({ message: "email and productId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await dbConnect();

    const updatedCart = await Cart.findOneAndUpdate(
      { email },
      { $pull: { items: { productId } } }, // Remove matching productId
      { new: true }
    ).populate("items.productId"); // Optional: populate updated cart items

    if (!updatedCart) {
      return new Response(
        JSON.stringify({ message: "Cart not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Item successfully removed from cart",
        cart: updatedCart,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete item error:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to remove item from cart",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
