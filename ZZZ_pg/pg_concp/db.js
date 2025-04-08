const db_url = 'postgresql://myuser:12345678@localhost:5432/postgres-basics'

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: db_url
})

const query = async(text,params)=>{
    const start = Date.now()
    try {
        const result = await pool.query(text,params)
        const duration =  Date.now() - start
        console.log("Time taken to exec query is",duration)
        return result;
    } catch (error) {
        console.log(error)
    }
}

module.exports = query;