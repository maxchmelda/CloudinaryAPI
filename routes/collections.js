import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. Načtení všech alb (subfolders v "albums")
    const albumsFolders = await cloudinary.api.sub_folders("albums");

    const albums = [];

    for (const folder of albumsFolders.folders) {
      const albumPath = folder.path;          // albums/album8
      const coverPath = `${albumPath}/cover`; // albums/album8/cover

      // 2. Načti cover (1 obrázek)
      const coverResult = await cloudinary.search
        .expression(`folder:${coverPath}`)
        .max_results(1)
        .execute();

      const coverImgUrl =
        coverResult.resources.length > 0
          ? coverResult.resources[0].secure_url
          : null;

      // 3. Načti fotky alba (bez cover složky)
      const imagesResult = await cloudinary.search
        .expression(`folder:${albumPath} AND NOT folder:${coverPath}`)
        .max_results(200)
        .execute();

      albums.push({
        name: folder.name,
        coverImgUrl,
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
