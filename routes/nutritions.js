const express = require("express")
const Nutrition = require("../models/nutrition")
const security = require("../middleware/security")
// const permissions = require("../middleware/permissions")
const router = express.Router()

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    // create a new post
    const { user } = res.locals
    const nutrition = await Nutrition.createNewPost({ user, post: req.body })
    return res.status(201).json({ nutrition })
  } catch (err) {
    next(err)
  }
})

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
      // list all posts
      const { user } = res.locals
      const nutrition = await Nutrition.listPosts(user)
      return res.status(200).json({ nutrition })
    } catch (err) {
      next(err)
    }
})

// fetch total calories 
router.get("/totalcalories", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    console.log("listing all posts")
    const { user } = res.locals
    const totalCalories = await Nutrition.fetchTotalCalories( user )
    return res.status(200).json({ totalCalories })
  } catch (err) {
    next(err)
  }
})

router.get("/:postId", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
      // fetch single post 
      const { user } = res.locals
      const { postId } = req.params
      const nutrition = await Nutrition.fetchPostById( user, postId )
      return res.status(200).json({ nutrition })
    } catch (err) {
      next(err)
    }
})


// router.patch("/:postId", security.requireAuthenticatedUser, permissions.authedUserOwnsPost, async (req, res, next) => {
//     try {
//       // update a single post
//       console.log("patch post")
//       const { postId } = req.params
//       const post = await Nutrition.editPost({ postUpdate: req.body, postId })
//       return res.status(200).json({ post })
//     } catch (err) {
//       console.log("error patching")
//       next(err)
//     }
// })

module.exports = router
