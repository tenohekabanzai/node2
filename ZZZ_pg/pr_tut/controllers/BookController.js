const {PrismaClient} = require('../generated/prisma')
const prisma = new PrismaClient()

const addBook = async(req,res)=>{
    let {title,authorId} = req.body
    authorId = Number(authorId)
    const date = Date.now()
    const d = new Date(date);
    try {
        const newBook = await prisma.book.create({
            data:{
                title,
                publishedDate:d,
                author: {
                    connect: {id:authorId}
                },
            },
            include:{author: true},
        })
        res.status(200).json(newBook)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getAllBooks = async(req,res)=>{
    try {
        const books = await prisma.book.findMany()
        res.status(200).json(books)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getBookById =async(req,res)=>{
    const id = Number(req.params.id);
    try {
        const book = await prisma.book.findUnique({
            where: {id},
            include: {author:true}
        })
        if(!book)
        return res.status(404).json({message:"Book with given id not found"})
        res.status(200).json(book)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const updateBook = async(req,res)=>{
    const id = Number(req.params.id);
    const newTitle = req.body.title
    try {
        const book = await prisma.book.update({
            where: {id},
            data:{
                title:newTitle
            },
            include:{author: true},   
        })
        res.status(200).json(book)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const updateBookByTransaction = async(req,res)=>{
    const id = Number(req.params.id);
    const newTitle = req.body.title 
    try {
        const book = await prisma.$transaction(async (prisma)=>{

            const book = await prisma.book.findUnique({
                where: {id}
            })
            if(!book)
            return res.status(404).json({message:"Book not found"})

            return prisma.book.update({
                where : {id},
                data: {
                    title: newTitle
                },
                include:{author: true}
            })
        })
        res.status(200).json(book)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const deleteBook = async(req,res)=>{
    const id = Number(req.params.id);
    try {
        const deleteBook = await prisma.book.delete({
            where:{id},
            include: { author:true}
        })

        res.status(200).json({message:"Book Deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {addBook,getAllBooks,getBookById,updateBook,updateBookByTransaction,deleteBook}