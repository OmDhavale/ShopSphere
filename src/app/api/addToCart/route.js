//API for adding item to cart 
import { dbConnect } from "../../../dbConfig/dbConnect";
import Cart from "../../../Models/CartModel/cart.model"
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    //const { email, productId, quantity } = await req.json();
    const { email, productId, quantity } = await req.json();

    // Check if cart exists for the user
    let cart = await Cart.findOne({ email });

    if (!cart) {
      // Create a new cart for the user
      cart = new Cart({
        email,
        items: [{ productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // If exists, increase quantity
        existingItem.quantity += quantity;
      } else {
        // Else, add new item
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    return NextResponse.json(
      { message: "Product added to cart successfully", cart },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error adding to cart", error: err.message },
      { status: 500 }
    );
  }
}
