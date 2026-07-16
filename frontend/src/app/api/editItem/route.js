//route for editing/ updating the existing item in the db based on _id
import { dbConnect } from "../../../dbConfig/dbConnect";
import itemModel from "../../../Models/ItemModel/item.model.js";

export async function PATCH(req) {
  try {
    // Parse the request body

   // console.log("Admin credentials ",adminEmail, adminPassword); // Debugging
 // Debugging
    const reqBody = await req.json();
    const { _id, ...updatedFields } = reqBody;
    // console.log("Received request body:", reqBody); // Debugging 
    if (!_id) {
      return new Response(JSON.stringify({ message: "Item _id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Updating item with _id:", _id); // Debugging
    console.log("Updated fields:", updatedFields); // Debugging

    // Connect to the database
    await dbConnect();

    // Find the item by _id and update it
    const updatedItem = await itemModel.findByIdAndUpdate(_id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update with schema
    });

    if (!updatedItem) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Item updated successfully:", updatedItem); // Debugging

    return new Response(
      JSON.stringify({
        message: "Item updated successfully",
        item: updatedItem,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error updating item:", err);

    return new Response(
      JSON.stringify({
        message: "Error updating item",
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
