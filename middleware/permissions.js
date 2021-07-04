const Nutrition = require("../models/nutrition")
const { BadRequestError, ForbiddenError } = require("../utils/errors")

//ensure authenticated user is owner of post
//if they aren't, throw an error
//otherwise we're good
const authedUserOwnsPost = async (req, res, next) => {
    try {
        const { user } = res.locals
        const { postId } = req.params
        const post = await Nutrition.fetchPostById(postId)

        if (post.userEmail !== user.email) {
            throw new ForbiddenError(`User is not allowed to update other users' posts.`)
        } 

        res.locals.post = post
    } catch(err){
        return next(err)
    }
}

module.exports = {
    authedUserOwnsPost
}