//Code for getting the product details of passed id from the api
//logic for getting items stored in database
import { dbConnect } from "../../../../dbConfig/dbConnect"
import itemModel from "../../../../Models/ItemModel/item.model.js";
export async function POST (req)  {
  await dbConnect(); // Connect to the database
  try {
    const request_body = await req.json();
    console.log(request_body); // Get the request body
    const productId = request_body.product; // Extract productId from the request body
    const data = request_body.data; // Extract data from the request body
    console.log("Name: ", productId.name); // Debugging
    // Debugging
    console.log("Category: ", productId.category); // Debugging
    console.log("Quantity: ", data.cartQuantity); // Debugging
    console.log("Total amount: ", data.totalAmount); // Debugging
    console.log("Address: ", data.address); // Debugging
    console.log("Phone no: ", data.phoneNumber); // Debugging
    console.log("Payment Option: ", data.paymentOption); // Debugging
    // Fetch the item with the given productId from the database
    const item = await itemModel.findOne({ _id: productId._id });
    
    // const items = await itemModel.find(); // Fetch all items from the database
    console.log("Item fetched from database:", item,data); // Debugging
    return new Response(
      JSON.stringify({
        message: "Items fetched successfully",
        item: item,
        data: data,
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
