import {  dbConnect } from "../../../dbConfig/dbConnect"
import itemModel from "../../../Models/ItemModel/item.model.js";
export async function POST(req){
    const reqBody = await req.json();
    console.log("Received request body:", reqBody); // Debugging
    await dbConnect(); // Connect to the database
    const item = new itemModel(reqBody);
    console.log("Item to be created:", item); // Debugging
    // const result = await item.save();
    try {
    const itemCreated = await itemModel.create(item);

    console.log("Item created:", itemCreated); // Debugging
    // Return the created item as a response
    
    return new Response(
      JSON.stringify({
        message: "Item created successfully",
        item: itemCreated,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
    
}
catch(err){
    console.log("Error creating item:",err)
    return new Response(
        JSON.stringify({
            message:"Error creating item",
            error: err.message,
        }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
    )
}

}