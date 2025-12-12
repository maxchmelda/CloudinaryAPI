import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. Načtení všech alb (subfolders v "albums")
    const albumsFolders = await cloudinary.api.sub_folders("albums");

    // 2. Načtení všech cover obrázků najednou
    const coversResult = await cloudinary.search
      .expression("folder:album-covers")
      .max_results(200)
      .execute();

    // Map: { albumName -> coverUrl }
    const coversMap = {};
    for (const img of coversResult.resources) {
      const nameWithoutExt = img.public_id.split("/").pop(); 
      coversMap[nameWithoutExt] = img.secure_url;
    }

    const albums = [];

    // 3. Pro každé album načteme fotky
    for (const folder of albumsFolders.folders) {
      const imagesResult = await cloudinary.search
        .expression(`folder:${folder.path}`)
        .max_results(200)
        .execute();

      albums.push({
        name: folder.name,
        coverImgUrl: coversMap[folder.name] || null,
        imageUrls: imagesResult.resources.map(img => img.secure_url),
      });
    }

    res.json({ albums });
  } catch (err) {
    console.error("Chyba Cloudinary:", err);
    res.status(500).json({ error: "Chyba při načítání dat z Cloudinary" });
  }
});

export default router;
