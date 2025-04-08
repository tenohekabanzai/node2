const query = require('../db.js')

const getUsersWithPosts = async()=>{
    const q = `
        select users.id, users.username, posts.title from 
        users inner join posts on users.id = posts.user_id
    `
    try {
        const resp = await query(q)
        console.log(resp.rows)
    } catch (error) {
        console.log(error)
    }
}

const getAllUsersWithPosts = async()=>{
    const q = `
        select users.id, users.username, posts.title from 
        users left join posts on users.id = posts.user_id
    `
    try {
        const resp = await query(q)
        console.log(resp.rows)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getUsersWithPosts,getAllUsersWithPosts}