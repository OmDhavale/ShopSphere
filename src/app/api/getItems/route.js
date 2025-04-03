//logic for getting items stored in database
import { dbConnect } from "../../../dbConfig/dbConnect.js";
import itemModel from "../../../Models/ItemModel/item.model.js";
export async function GET ()  {
  await dbConnect(); // Connect to the database
  try {
    const items = await itemModel.find(); // Fetch all items from the database
    console.log("Items fetched from database at backend"); // Debugging
    return new Response(
      JSON.stringify({
        message: "Items fetched successfully",
        items: items,
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
