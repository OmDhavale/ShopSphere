import bcrypt from "bcryptjs";
import userModel from "../../../Models/UserModel/user.model.js";
import { dbConnect } from "../../../dbConfig/dbConnect.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
/**
 *
 * SIGN IN or LOGINFUNCTION
 */
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
    // return res.status(400).send({  //Old one for express.js framework
    //   message: "User Email is not valid !",
    // });
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
    // return res.status(400).send({  //Old one for express.js framework
    //   message: "Wrong Password entered !",
    // });
  }

  //Using json web token(jwt) we will create the access token with given ttl(time to live) and return

  // const token = jwt.sign({ id: user.userID }, secret.secretString, {
  //   expiresIn: 600, //120 seconds = 2 mins
  // });
  /**
     * for creating a token we need to give 3 fields: 
     * 1. on basis of whom we have to generate token (here we took userID)
     * 2. any random string for more security
     * 3. Time of expiry
     * const token = jwt.sign({id : user.userID},"any secret string",{     
        expiresIn : 120 //120 seconds = 2 mins
        })
        we can write this secret string in config file also
     */
  // res.status(200).send({
  //   message: "User logged in succesful !",
  //   name: user.name,
  //   email: user.email,
  //   accessToken: token,
  // });
  //code for storing the value into local storage

  // res.status(200).send({
  //   message: "User logged in succesful !",
  //   name: user.name,
  //   email: user.email,
  //   accessToken: token,
  // });
  // //code for storing the value into local storage
  // localStorage.setItem("token", token);
  // localStorage.setItem("email", user.email);
  // localStorage.setItem("name", user.name);

  // res.headers["Set-Cookie"] = cookie.serialize("email", user.email, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "Strict",
  //   path: "/",
  // });

  // res.headers["Set-Cookie"] = cookie.serialize("name", user.name, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "Strict",
  //   path: "/",
  // });

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