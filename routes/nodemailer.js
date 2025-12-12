import express from "express"
import nodemailer from "nodemailer"

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
    // transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
      secure: false, // true pouze pro port 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    // email
    await transporter.sendMail({
      from: `"Kontakt z webu" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      replyTo: email,
      subject: "Nová zpráva z kontaktního formuláře",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Nová zpráva z webu</h2>
          <p><strong>Jméno:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || "-"}</p>
          <p><strong>Typ focení:</strong> ${shootType}</p>
          <p><strong>Zpráva:</strong></p>
          <p>${message || "-"}</p>
        </div>
      `,
    })

    res.json({ success: true })
  } catch (err) {
    console.error("Nodemailer error:", err)
    res.status(500).json({
      error: "Failed to send email",
    })
  }
})

export default router
