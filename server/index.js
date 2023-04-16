const express = require('express');
const cors = require('cors'); // cross orgin request

const authRoutes = require("./routes/auth.js");

const app = express(); // instance of epxress app
const PORT = process.env.PORT || 5000;

require('dotenv').config(); // allows to call environment variables inside node app
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGEING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid,authToken);

//middlewares
app.use(cors()); 
app.use(express.json()); // allows to send json payload fron frontend to backend
app.use(express.urlencoded()); // built-in

//routes
app.get('/', (req,res) => {
    res.send("Hello world");
})

app.post('/', (req,res) => {
    const {message, user: sender, type, members} = req.body;
    if(type === 'message.new'){
        members
        .filter((member) => member.user.id !== sender.id)
        .forEach(( {user} ) => {
            if(!user.online) {
                twilioClient.messages.create({
                    body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                    messagingServiceSid: messagingServiceSid, 
                    to: user.phoneNumber
                })
                .then(() => console.log('Message sent'))
                .catch((err) => console.log(err));

            }
        })
        return res.status(200).send('Message sent');
        console.log("hello swathi !")
    }
    return res.status(200).send('not a new message request');
})

app.use('/auth',authRoutes);
app.listen(PORT, () => console.log(`server running on port ${PORT}`));