const nodeMailer = require('nodemailer');
const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service: process.env.SMTP_SERVICE,// gmail/yahoo/redmail etc
        auth: {
            user: process.env.SMTP_MAIL, // sender mail address
            pass: process.env.SMTP_PASSWORD // sender password
        }

    })
    const mailOptions = {
        from: process.env.SMTP_MAIL,// sender mail address
        to: options.email,            //  to whom to send
        subject: options.subject,
        text: options.messageInEmail
    }
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail 