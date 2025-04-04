import bcrypt from "bcryptjs";
import userModel from "../../../Models/UserModel/user.model.js";
import { dbConnect } from "../../../dbConfig/dbConnect.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
/**
 *
 * SIGN IN or LOGINFUNCTION
 */
//Add middleware for checking the request is of admin or not

export async function POST(req){
  await dbConnect(); //connect to the database
  const request_body = await req.json();
  //Check if email is present in the db or not
  const user = await userModel.findOne({ email: request_body.email });
  if (user == null) {
    console.log("User Email passed not found");

    return new Response(
      JSON.stringify({
        message: "User Email not found !",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  //If user id is present check if password is matching or not
  const pass = bcrypt.compareSync(request_body.password, user.password);
  //                                ^sent by postman        ^already stored in db
  //bcrypt by means of "compareSync" #library of bcrypt this encrypts the request password and
  // then compares it with encrypted password in the db
  if (!pass) {
    console.log("Wrong password ");
    
    return new Response(
      JSON.stringify({
        message: "Wrong Password entered !",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "User logged in succesful !",
      username: user.username,
      email: user.email,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" ,
      },
    }
  );
};