const query = require('../db.js')

const countPostsByUser = async(username)=>{
    const q = `
        select  users.username, count(posts.id) as post_count from
        users left join posts on users.id = posts.user_id group by users.username order by count(posts.id) asc
    `
    try {
        const resp = await query(q);
        console.log(resp.rows);
    } catch (error) {
        console.log(error)
    }
}

module.exports = {countPostsByUser}