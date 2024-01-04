const nodemailer = require("nodemailer");
 const generateOTP = () => {
   return Math.floor(100000 + Math.random() * 900000);
 };
  const sendOTPEmail = async (email, otp) => {
    try {
      // Create a nodemailer transporter using your email service provider's details
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tanmaytrivedi57@gmail.com", // Your email address
          pass: "tanmay123@", // Your email password or an app-specific password
        },
      });

      // Message configuration
      const mailOptions = {
        from: "tanmaytrivedi@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

exports.otpverify = (req, res) => {
  // Function to generate a random OTP
    const email = req.body.email;
    const otp = generateOTP();

    sendOTPEmail(email, otp);
 

  // Function to send OTP via email
 
  // Example usage

};
