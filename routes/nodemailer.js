import express from "express"
import axios from "axios"

const router = express.Router()

router.post("/", async (req, res) => {
  const { name, email, phone, shootType, message } = req.body

  // základní validace
  if (!name || !email || !shootType) {
    return res.status(400).json({
      error: "Missing required fields",
    })
  }

  try {
    await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          name,
          email,
          phone: phone || "-",
          shoot_type: shootType,
          message: message || "-",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    res.json({ success: true })
  } catch (err) {
    console.error(
      "EmailJS error:",
      err.response?.data || err.message
    )

    res.status(500).json({
      error: "Failed to send email",
    })
  }
})

export default router
