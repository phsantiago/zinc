const nodemailer = require('nodemailer');

const sender = ({ user, pass }) => ({subject, html, from, to}) => {
  const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user,
          pass,
      }
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  return new Promise( (res, reject) => transporter.sendMail(mailOptions, function (err, info) {
       if(err)
         reject(err);
       else
         res(info);
    })
  );
}

module.exports = sender;
