import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Vyhledá všechny obrázky ve složce "slider"
    const sliderImages = await cloudinary.search
      .expression("folder:slider")
      .sort_by("public_id", "asc")
      .max_results(200)
      .execute();

    const urls = sliderImages.resources.map(img => img.secure_url);

    res.json(urls);
  } catch (err) {
    console.error("Chyba Cloudinary:", err);
    res.status(500).json({ error: "Nepodařilo se načíst slider obrázky" });
  }
});

export default router;
