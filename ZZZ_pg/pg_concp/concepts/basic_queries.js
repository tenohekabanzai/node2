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
const insertUser = async(username,email)=>{

    username = username.toLowerCase();
    email = email.toLowerCase();

    const insertQuery = `
        INSERT INTO users (username,email)
        VALUES ($1,$2)
        RETURNING *
    `
    try {
        const result = await query(insertQuery,[username,email]);
        return result.rows[0];
    } catch (error) {
        console.log(error)
    }
}

const getAllUsers = async()=>{
    const getQuery = `
        select * from users;
    `
    try {
        const result = await query(getQuery);
        return result.rows;
        // console.log(result.rows)
    } catch (error) {
        console.log(error)
    }
}

const getUserbyUsername = async(username)=>{
    const getQuery = `
        select * from users where username = ${username}
    `
    try {
        const result = await query(getQuery)
        return result.rows;
    } catch (error) {
        console.log(error)
    }
}

const updateEmail=async(username,email)=>{
    console.log(email,username)
    const updateQuery= `
        update users set email='${email}' where username='${username}'
    `
    try {
        const resp  = await query(updateQuery)
        return resp.rows;
    } catch (error) {
        console.log(error)
    }
}

const deleteUser = async(username)=>{
    const delQuery = `
        delete from users where id =${username} 
    `
    try {
        const result = await query(delQuery)
        return result.rows;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createTable,insertUser,getAllUsers,deleteUser,getUserbyUsername,updateEmail}