var nodemailer = require('nodemailer');

function sendmail(email, password) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vijay.soni011official@gmail.com',
            pass: ''
        }
    });

    var mailOptions = {
        from: 'vijay.soni011official@gmail.com',
        to: email,
        subject: 'NewBiz Verify Account Mail',
        html: '<h3>Email :'+email+'</h3><h3>Password :'+password+"</h3><p>http://localhost:3000/verifyuser?email="+email+"</p>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports=sendmail

