// timers -> pending callbacks -> Idle/prepare ->poll -> check -> close callback

const fs = require('fs')
const crypto = require('crypto')

console.log('1 Script Start')

setTimeout(() => {
    console.log('2 setTimeout 0s callback')
}, 0)

setTimeout(() => {
    console.log('3 setTimeout 0s callback')
}, 0)

setImmediate(()=>{
    console.log('4 setImmediate callback (check)')
})

Promise.resolve().then(()=>{
    console.log('5 Promise Resolved (microtask)')
})

process.nextTick(()=>{
    console.log('6 nextTick callback (microtask)')
})

fs.readFile(__filename,()=>{
    console.log('7 file I/O operation')
})

crypto.pbkdf2('secret','salt',100000,64,'sha512',(err,key)=>{
    if(err)
        throw err
    console.log('8 crypto.pbkdf2 op completed (CPU intensive task)' )
})

console.log('9 Script ends')



