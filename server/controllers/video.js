import { createError } from '../error.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

export const addVideo = async (req,res,next) => {
    try{
        const video = new Video({userId:req.user.id, ...req.body});
        const savedVideo = await video.save();
        res.status(200).json(savedVideo);
    }catch(err){
        next(err);
    }
}

export const updateVideo = async (req,res,next) => {
    try{
       //const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{$set: req.body});
       const video = await Video.findById(req.params.id);
       if(!video) return next(createError(404,"Video Not Found"));

       if(req.user.id === video.userId){//only update if video owner is logged in user
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updateVideo);
       }else{
        return next(createError(403,"You Can Only Update Your Video"));
       }
       
    }catch(err){
        next(err);
    }
}

export const deleteVideo = async (req,res,next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video Not Found"));

        if (req.user.id === video.userId) {//only update if video owner is logged in user
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("Video Deleted Successfully!");
        } else {
            return next(createError(403, "You Can Only Delete Your Video"));
        }
    } catch (err) {
        next(err);
    }
}

export const getVideo = async (req,res,next) => {
    try{
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    }catch(err){
        next(err);
    }
}

export const increaseViews = async (req,res,next) => {
    try{
       await Video.findByIdAndUpdate(req.params.id,{
        $inc:{views:1}
       });
        res.status(200).json("view of video incremented!");
    }catch(err){
        next(err);
    }
}

export const trendingVideos = async (req,res,next) => {
    try{
        const videos = await Video.find().sort({views:-1})//-1 is to indicate most views 1 is for least views
        res.status(200).json(videos);
    }catch(err){
        next(err);
    }
}

export const randomVideos = async (req,res,next) => {
    try{
        const videos = await Video.aggregate([{$sample:{size:40}}]);
        res.status(200).json(videos);
    }catch(err){
        next(err);
    }
}

export const subscribedVideos = async (req,res,next) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user) next(createError(404,"User not found!"));

        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(channelId => {return Video.find({userId:channelId})})
        );

        res.status(200).json(list.flat().sort((a,b)=> b.createdAt - a.createdAt));
    }catch(err){
        next(err);
    }
}

export const getByTag = async (req,res,next) => {
   
    try{
        const tags = req.query.tags.split(",");//with the format(url): .../videos/tags?tags=..,..,..,
        const videos = await Video.find({tags: {$in:tags}}).limit(20);//-1 is to indicate most views 1 is for least views
        res.status(200).json(videos);
    }catch(err){
        next(err);
    }
}


export const search = async (req,res,next) => {
    try{
        const query = req.query.q;
        const videos = await Video.find({title:{$regex:query,$options:"i"}}).limit(20)//option i is case insensetive
        res.status(200).json(videos);
    }catch(err){
        next(err);
    }
}