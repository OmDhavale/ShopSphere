//Code for getting the product details of passed id from the api
//logic for getting items stored in database
import { dbConnect } from "../../../../dbConfig/dbConnect"
import itemModel from "../../../../Models/ItemModel/item.model.js";
export async function POST (req)  {
  await dbConnect(); // Connect to the database
  try {
    const request_body = await req.json();
    console.log(request_body) // Get the request body
    const productId = request_body.productId; // Extract productId from the request body
    console.log("Product ID:", productId); // Debugging
    // Fetch the item with the given productId from the database
    const item = await itemModel.findOne({ _id: productId });
    // const items = await itemModel.find(); // Fetch all items from the database
    console.log("Item fetched from database:", item); // Debugging
    return new Response(
      JSON.stringify({
        message: "Items fetched successfully",
        item: item,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error fetching items:", err); // Debugging
    return new Response(
      JSON.stringify({
        message: "Error fetching items",
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
