// readable 
// writable
// duplex -> read + write
// transform -> zlib streams for zippping files

const fs = require('fs')
const zlib = require('zlib')
const crypto = require('crypto')
const {Transform} = require('stream')

class EncryptStream extends Transform{
    constructor(key,vector){
        super();
        this.key = key;
        this.vector = vector;
    }
    _transform(chunk,encoding,callback){
        const cipher = crypto.createCipheriv('aes-256-cbc',this.key,this.vector)
        // encrypt chunk
        const encrypted = Buffer.concat([cipher.update(chunk),cipher.final()])
        this.push(encrypted)
        callback()
    }
}

const key = crypto.randomBytes(32)
const vector = crypto.randomBytes(16)

// read stream to read the input.txt file
const readableStream = fs.createReadStream('./input.txt')
// new gzip object to compress the stream of data comping from input.txt
const gzipStream = zlib.createGzip()
// stream for encryption
const encryptStream = new EncryptStream(key,vector)
// stream for writing to txt file
const writableStream = fs.createWriteStream('output.txt.gz.enc')

// read -> zip -> encrypt -> write
readableStream.pipe(gzipStream).pipe(encryptStream).pipe(writableStream);