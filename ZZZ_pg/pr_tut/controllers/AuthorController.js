const {PrismaClient} = require('../generated/prisma')
const prisma = new PrismaClient()

const addAuthor = async(req,res)=>{
    const {name} = req.body
    try {
        const newAuthor = await prisma.author.create({
            data:{
                name
            }        
        })
        res.status(200).json(newAuthor)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const deleteAuthor = async(req,res)=>{
    const id = Number(req.params.id)
    try {
        const newAuthor = await prisma.author.delete({where:{id}})
        res.status(200).json({message:"Author deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {addAuthor,deleteAuthor}