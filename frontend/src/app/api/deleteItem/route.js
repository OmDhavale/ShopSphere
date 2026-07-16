//Declaring route for deleting an item from db based on id
import {  dbConnect } from "../../../dbConfig/dbConnect"
import itemModel from "../../../Models/ItemModel/item.model.js";
export async function POST(req){
    const reqBody = await req.json();
    console.log("Received request body:", reqBody); // Debugging
    await dbConnect(); // Connect to the database
    console.log("Item to be deleted:", reqBody._id); // Debugging
    // const result = await item.save();
    const item = new itemModel(reqBody);
    try {
        //Delete the item from the database using the id provided in the request body
        const itemDeleted = await itemModel.findByIdAndDelete(item._id);
        if (!itemDeleted) {
            return new Response(
                JSON.stringify({
                    message: "Item not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        console.log("Item deleted:", itemDeleted); // Debugging
        // Return the deleted item as a response
        return new Response(
            JSON.stringify({
                message: "Item deleted successfully",
                item: itemDeleted,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
    catch(err){
        console.log("Error deleting item:",err)
        return new Response(
            JSON.stringify({
                message:"Error deleting item",
                error: err.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )
    }
}