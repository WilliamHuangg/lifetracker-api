const db = require("../db")
const { BadRequestError, NotFoundError } = require("../utils/errors")

class Nutrition {
    static async listPosts(user){
        //list all nutrition posts in db in desc order
        const results = await db.query(
            `
            SELECT  n.id,
                    n.name,
                    n.category,
                    n.quantity,
                    n.calories,
                    n.image_url AS "imageUrl",
                    n.user_id AS "userId",
                    u.email AS "userEmail",
                    n.created_at AS "createdAt"
            FROM nutrition AS n
                JOIN users AS u ON u.id = n.user_id
            WHERE n.user_id = (SELECT id FROM users WHERE email = $1)
            ORDER BY n.created_at DESC
            `, [user.email]
        )
        
        return results.rows
    }

    static async fetchPostById(user, postId){
        //fetch a single post
        const results = await db.query(
            `
            SELECT  n.id,
                    n.name,
                    n.category,
                    n.quantity,
                    n.calories,
                    n.image_url AS "imageUrl",
                    n.user_id AS "userId",
                    u.email AS "userEmail",
                    n.created_at AS "createdAt"
            FROM nutrition AS n
                JOIN users AS u ON u.id = n.user_id
            WHERE n.user_id = (SELECT id FROM users WHERE email = $1) AND n.id = $2
            `, [user.email, postId]
        )

        const post = results.rows[0]
        if (!post) {
            throw new NotFoundError()
        }
        return post
    }

    static async createNewPost({ post, user }){
        //create a new post
        const requiredFields = ["name", "category", "quantity", "calories", "imageUrl"]
        requiredFields.forEach((field) => {
            if (!post.hasOwnProperty(field)) {
                throw new BadRequestError(`Required field - ${field} - missing from request body`)
            }
        })

        if (post.name.length > 50 ) {
            throw new BadRequestError(`Post name must be 50 characters or less`)
        }

        const results = await db.query(
            `
            INSERT INTO nutrition (name, category, quantity, calories, image_url, user_id)
            VALUES ($1, $2, $3, $4, $5, (SELECT id FROM users WHERE email = $6) )
            RETURNING   id, 
                        name,
                        category,
                        quantity,
                        calories,
                        image_url AS "imageUrl",
                        user_id AS userId,
                        created_at AS "createdAt";
            `,          
            [post.name, post.category, post.quantity, post.calories, post.imageUrl, user.email],
        )
        return results.rows[0]
    }

    static async fetchTotalCalories ( user ) {
        const results = await db.query(
            `
            SELECT SUM(calories) FROM nutrition
            WHERE user_id = (SELECT id FROM users WHERE email = $1)
            `,[user.email]
        )
        return results.rows[0]
    }

    // static async editPost({ postId, postUpdate }){
    //     //edit a post
    //     const requiredFields = ["name"]
    //     requiredFields.forEach((field) => {
    //         if (!postUpdate.hasOwnProperty(field)) {
    //             throw new BadRequestError(`Required field - ${field} - missing from request body`)
    //         }
    //     })

    //     const results = await db.query(
    //         `
    //         UPDATE nutrition
    //         SET name = $1,
    //         WHERE id = $2
    //         RETURNING   id, 
    //                     name,
    //                     category,
    //                     quantity,
    //                     calories,
    //                     image_url AS "imageUrl",
    //                     user_id AS userId,
    //                     created_at AS "createdAt";
    //         `, 
    //         [ postUpdate.name, postId ]
    //     )

    //     return results.rows[0]
    // }
}

module.exports = Nutrition