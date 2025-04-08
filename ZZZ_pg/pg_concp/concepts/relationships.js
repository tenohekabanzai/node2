const query = require('../db')
const createTable = async()=>{
    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
    try {
        await query(createTableQuery)
        console.log('User table created successfully')
    } catch (error) {
        console.log('Error while creating User table')
    }
}

const createPostTable = async()=>{
    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS posts(
            id SERIAL PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            content VARCHAR(255) NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `
    try {
        await query(createTableQuery)
        console.log('Posts table created successfully')
    } catch (error) {
        console.log('Error while creating User table')
    }
}

const insertPost = async(title,content,userId)=>{
    const q= `
      insert into posts (title,content,user_id)
      values ($1,$2,$3)  RETURNING *
    `
    try {
        const resp = await query(q,[title,content,userId])
        return resp.rows;
    } catch (error) {
        console.log('Error while inserting POST')
    }

}

module.exports = {createPostTable,insertPost}