const query = require('../db')

const getUsersWhere = async(condition)=>{
    const q = `
        select * from users where ${condition}
    `
    try {
        const resp = await query(q)
        return resp.rows;
    } catch (error) {
        console.log(error)
    }
}

const getUsersSorted= async(column,order)=>{
    const q = `
        select * from users order by ${column} ${order}
    `
    try {
        const resp = await query(q)
        return resp.rows;
    } catch (error) {
        console.log(error)
    }
}

const getPaginatedUsers = async(limit,offset)=>{
    
    const q = `
        select * from users limit $1 offset $2
    `
    try {
        const resp = await query(q,[limit,offset])
        return resp.rows;
    } catch (error) {
        console.log(error)
    }

}

module.exports = {getUsersWhere,getUsersSorted,getPaginatedUsers}