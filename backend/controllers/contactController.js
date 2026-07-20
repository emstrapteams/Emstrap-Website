const sendMail = require("../utils/mail");

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex =
/^[0-9+\-\s()]{7,25}$/;

exports.sendContactMail = async (req, res) => {

    try {

        const {

            fullName,
            organization,
            email,
            phone,
            message

        } = req.body;

        if (
            !fullName ||
            !organization ||
            !email ||
            !phone ||
            !message
        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Invalid email address."

            });

        }

        if (!phoneRegex.test(phone)) {

            return res.status(400).json({

                success: false,

                message: "Invalid phone number."

            });

        }

        await sendMail({

            fullName: fullName.trim(),

            organization: organization.trim(),

            email: email.trim(),

            phone: phone.trim(),

            message: message.trim()

        });

        return res.status(200).json({

            success: true,

            message: "Message sent successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to send message."

        });

    }

};