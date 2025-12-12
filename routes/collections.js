import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const albumsFolders = await cloudinary.api.sub_folders("albums");

    const albums = await Promise.all(
      albumsFolders.folders.map(async (folder) => {
        const albumPath = folder.path;
        const coverPath = `${albumPath}/cover`;

        const [coverResult, imagesResult] = await Promise.all([
          cloudinary.search
            .expression(`folder:${coverPath}`)
            .max_results(1)
            .execute(),

          cloudinary.search
            .expression(`folder:${albumPath} AND NOT folder:${coverPath}`)
            .max_results(200)
            .execute(),
        ]);

        return {
          name: folder.name,
          coverImgUrl: coverResult.resources[0]?.secure_url ?? null,
          imageUrls: imagesResult.resources.map(img => img.secure_url),
        };
      })
    );

    res.json({ albums });
  } catch (err) {
    console.error("Cloudinary error:", err);
    res.status(500).json({ error: "Chyba při načítání alb" });
  }
});

export default router;