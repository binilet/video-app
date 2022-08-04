import { createError } from "../error.js"
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req,res,next)=>{
    if(req.params.id === req.user.id){//req.user.id is the object that is assigned on verifyToken method
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },
                {new:true}//this will send the updated user
            );
            res.status(200).json({updatedUser});
        }catch(err){
            next(err);
        }
    }else{
        return next(createError(403,"You Can only update your own account!"))
    }
}

export const deleteUser = async (req,res,next) => {

    if(req.params.id === req.user.id){//req.user.id is the object that is assigned on verifyToken method
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        }catch(err){
            next(err);
        }
    }else{
        return next(createError(403,"You Can only delete your own account!"))
    }

}

export const getUser = async (req,res,next)=>{
   try{
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
   }catch(err){
    next(err);
   }
}

export const subscribe = async (req,res,next)=>{
    try{
        await User.findByIdAndUpdate(req.user.id,{
            $push:{ subscribedUsers:req.params.id}});//passed id(params) is the channel/user id to be subscribed to

        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:1}
        });
        res.status(200).json("Subscription Successfull");
    }catch(err){
        next(err);
    }
}

export const unsubscribe = async (req,res,next)=>{
    try{
        await User.findByIdAndUpdate(req.user.id,{
            $pull:{subscribedUsers:req.params.id}});//passed id(params) is the channel/user id to be subscribed to

        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:-1}
        });
        res.status(200).json("unSubscription Successfull");
    }catch(err){
        next(err);
    }
}

export const like = async (req, res, next) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate
            (req.params.videoId,
                { $addToSet: {likes :req.user.id},$pull:{dislikes:req.user.id}},
                { new: true }
            );
        res.status(200).json("Video has been liked!");
    } catch (err) {
        next(err);
    }
}

export const dislike = async (req,res,next)=>{
    try{
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.videoId,{$addToSet:{dislikes: req.user.id},$pull:{likes:req.user.id}},
            { new: true }
        );
        res.status(200).json("Video has been disliked!");

    }catch(err){
        next(err);
    }
}