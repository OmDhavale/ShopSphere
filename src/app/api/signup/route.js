import bcrypt from "bcryptjs";
import userModel from "../../../Models/UserModel/user.model.js";
import { dbConnect } from "../../../dbConfig/dbConnect.js";
//Logic to sign up/ register a user
exports.signup = async (req, res) => {
    await dbConnect(); //connect to the database

  //Steps
  //1.read request body
  const request_body = req.body;
  console.log(request_body);
  //2.insert data in users collection in MongoDB

  const user_obj = {
    email: request_body.email,
    password: bcrypt.hashSync(request_body.password, 8),
  };
  //3. Return response back to user
  try {
    const usercreated = await userModel.create(user_obj);
    //return this user
    const usercreated2 = {
      email: usercreated.email,
      createdAt: usercreated.createdAt,
      updatedAt: usercreated.updatedAt,
    };

    res.status(201).send({
      message: "User created",
      usercreated2,
    }); //201 : something succesfully created
  } catch (err) {
    console.log("Error registering the user");
    res.status(500).send({
      //500 : internal server error
      message: "some error happened while registering user try again..",
    });
  }
};
