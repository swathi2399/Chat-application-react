const {connect} = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require("stream-chat").StreamChat;
const crypto = require('crypto');

require('dotenv').config(); 

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

//every controller will have req,res - req contains info that comes from frontend
const signup = async (req,res) => {
    try {
        const {userName,password,fullName,phoneNumber } = req.body;
    //     console.log("inside the signup")
    //    console.log(userName,fullName)
        const userId = crypto.randomBytes(16).toString('hex');
        const serverClient = connect(api_key,api_secret,app_id); // all these are secret so used environment variable
        const hashedPassword = await bcrypt.hash(password,10); //sha 256
        const token = serverClient.createUserToken(userId);

        res.status(200).json({token,fullName,userName,userId,hashedPassword,phoneNumber});

    } catch(error) {
        console.log(error);

        res.status(500).json({message: error});
    }
};

const login = async(req,res) => {
    try {
        const {userName,password} = req.body;
        
        const serverClient = connect(api_key,api_secret,app_id); // all these are secret so used environment variable
        const client = StreamChat.getInstance(api_key,api_secret);
        const {users} = await client.queryUsers( {name: userName});
        console.log('logged users',users)
        if(!users.length) return res.status(400).json({message:"user not found"});

        const success = await bcrypt.compare(password,users[0].hashedPassword);
        const token = serverClient.createUserToken(users[0].id);
        if(success) {
            res.status(200).json({token,fullName: users[0].fullName,userName,userId: users[0].id})       
         } else {
            res.status(500).json({message:"incorrect password"})
         }

    } catch(error) {
        console.log(error);

        res.status(500).json({message: error});
    }
};



module.exports = {signup,login};