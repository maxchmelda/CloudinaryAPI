import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. Získáme všechny složky (kolekce)
    const folders = await cloudinary.api.sub_folders("albums");

    const result = [];

    // 2. Pro každou složku získáme obrázky
    for (const folder of folders.folders) {
      const resources = await cloudinary.search
        .expression(`folder:${folder.path}`)
        .max_results(200)
        .execute();

      result.push({
        nazevKolekce: folder.name,
        fotoUrls: resources.resources.map((img) => img.secure_url),
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Chyba Cloudinary:", err);
    res.status(500).json({ error: "Chyba při načítání dat z Cloudinary" });
  }
});

export default router;