const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asynchandler = require("express-async-handler");
function generatetoken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
}

exports.registerUser = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(404);
    throw new Error("please enter  all feilds");
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  const userExists = await User.findOne({email: email });
  if (userExists) {
    res.status(404);

    throw new Error("user already exists");
  }
  const newuser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    pic: pic,
  });
  const saved = await newuser.save();
  res.status(201).json({
    name: name,
    email: email,
    password: password,
    pic: pic,
    token: generatetoken(newuser._id),
  });
});

exports.login = asynchandler(async (req, res) => {
  const { password, email } = req.body;
  console.log(email)

  const user = await User.findOne({email:email});
   console.log("object");
   console.log(user)
  if (user) {
    console.log("object")
    const match = await bcrypt.compare(password, user.password);
    console.log(match)
    if (match) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          token: generatetoken(user._id),
        });
    
    }
    else{
        res.status(404).send({ message: "incorrect password" });
        throw new Error("user already exists in match");
    }
   
  } else {
    res.status(404);
    throw new Error("user already exists");
  }
});

exports.allUsers = asynchandler(async (req, res) => {
  console.log(req.user);
  try {
    console.log("inside all users");
    const querydata = req.query.search?{
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log(req.user.id);
    const user = await User.find(querydata).find({
      _id: { $ne: req.user._id },
    });
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});
