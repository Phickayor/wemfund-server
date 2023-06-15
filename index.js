var express = require("express")
var app = express()
const PORT = process.env.PORT || 3001;
require("dotenv").config();
const bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
const cors = require("cors");
// using cors
app.use(
    cors({
        origin: ["https://trippayer.netlify.app", "https://trippayer.com", "https://www.trippayer.com"], // restrict calls to those this address
        methods: "POST" // only allow POST requests
    })
);
//using body-parser
// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/message", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    var details = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }
    //Transporter Details
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    })

    var mailOptions = {
        from: details.email,
        to: process.env.MAIL_USERNAME,
        subject: details.name + " sending Email from Trippayer Website",
        text: details.message + "\n sent from " + details.email
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            res.json({ "info": "failed" })
            console.log(err);
        } else {
            console.log("Email sent: " + info.response);
            res.json({ "info": "success" })
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
