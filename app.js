const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/3ed967e049";
  const options = {
    method: "POST",
    auth: `mailchimp:${process.env.API_KEY}`,
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});

// api key
// 787c0e97a194e8898e61535281310997-us21 revoked
// 5d5b62a65948a901f2366f934e040553-us21 revoked
// https://us6.api.mailchimp.com/3.0/
// 3ed967e049
