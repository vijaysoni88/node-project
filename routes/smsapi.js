var unirest = require("unirest");

function sendSMS(mobile, otp) {
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");
  req.query({
    "authorization":"Fwj6ng05vebLfsMIJCAkHyW9BzUu7pOVmoKYdtTQR8GqcXZ2i1HTZxI16SOzghUs4Vivf2XRjJtoyLK8",
    "sender_id": "MAHBIZ",
    "message": "You are  successfully registered to brand new business platform. Thanks!!"+otp,
    "language": "english",
    "route": "p",
    "numbers": mobile,
  });

  req.headers({
    "cache-control": "no-cache"
  });


  req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
  });
}

module.exports=sendSMS