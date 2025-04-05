//function for getting products in MY cart
import { dbConnect } from "../../../dbConfig/dbConnect";
import Cart from "../../../Models/CartModel/cart.model"
import itemModel from "../../../Models/ItemModel/item.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ email }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty", cart: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Cart fetched successfully", cart },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching cart", error: err.message },
      { status: 500 }
    );
  }
}
