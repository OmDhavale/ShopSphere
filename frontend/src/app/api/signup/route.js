import bcrypt from "bcryptjs";
import userModel from "../../../Models/UserModel/user.model.js";
import { dbConnect } from "../../../dbConfig/dbConnect.js";
//Logic to sign up/ register a user
export async function POST(req) {
  await dbConnect(); //connect to the database

  //Steps
  //1.read request body
  const request_body = await req.json();
  console.log("request_body : ",request_body);
  console.log("Received username:", request_body.username); // debugging
  console.log("Received email:", request_body.email); // debugging
  console.log("Received password:", request_body.password); // debugging

  //2.insert data in users collection in MongoDB
  const hashedPassword = bcrypt.hashSync(request_body.password, 8);
  const user_obj = {
    username: request_body.username,
    email: request_body.email,
    password: hashedPassword,
  };
  //3. Return response back to user
  try {
    const usercreated = await userModel.create(user_obj);
    //return this user
    const usercreated2 = {
      email: usercreated.email,
    };

    // res.status(201).send({
    //   message: "User created",
    //   usercreated2,
    // }); //201 : something succesfully created

    return new Response(
      JSON.stringify({
        message: "User created",
        usercreated2,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.log("Error registering the user", err);
    // res.status(500).send({
    //   //500 : internal server error
    //   message: "some error happened while registering user try again..",
    // });
    return new Response(
      JSON.stringify({
        message: "some error happened while registering user try again..",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
