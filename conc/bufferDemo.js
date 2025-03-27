/// object -> handle raw binary data
// file system ops, cryptography, image processing

const buffOne = Buffer.alloc(10)
console.log(buffOne)

const buffFromString = Buffer.from("Hello Good Morning")
console.log(buffFromString)

const buffFromArrayint = Buffer.from([1,2,3,4,5])
console.log(buffFromArrayint)

buffOne.write("Node js")
console.log('buffOne after rewriting ->',buffOne.toString())

console.log(buffFromString.slice(0,3))

const concatBuffs = Buffer.concat([buffOne,buffFromString])
console.log(concatBuffs)
console.log(concatBuffs.toJSON())