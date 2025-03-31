import { dbConnect } from "../../../dbConfig/dbConnect.js";

/**
 * LOGOUT CONTROLLER
 */
export default logout = async (req, res) => {
  await dbConnect(); //connect to the database
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out succesful" });
  } catch (error) {
    console.log("Error logging out");
  }
};