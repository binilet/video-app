import express from "express";
import { addVideo, deleteVideo, getByTag, getVideo, increaseViews, randomVideos, search, subscribedVideos, trendingVideos, updateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/",verifyToken,addVideo);

router.put("/:id",verifyToken,updateVideo);

router.delete("/:id",verifyToken,deleteVideo);

router.get("/find/id",getVideo);

router.put("/view/:id",increaseViews);

router.get("/trend",trendingVideos)

router.get("/random",randomVideos)

router.get("/sub",verifyToken,subscribedVideos)


router.get("/tags",getByTag)


router.get("/search",search)

export default router;