const express = require ('express')
const bodyParser = require('body-parser')
const mc = require ('./messagesCtrl')
const session = require('express-session')
require('dotenv').config()

const app = express()

app.use(bodyParser.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))

app.use((req,res,next) => {
    let badWords = ['Freaking heck', 'Darnation', 'Helibut']
    if(req.body.message) {
        for(let i=0; i<badWords.length; i++){
            let regex = new RegExp(badWords[i], 'g')
            req.body.message = req.body.message.replace(regex, '******')
        }
        next()
    }else {
        next()
    }
})

app.get('/api/messages', mc.getAllMessages)
app.post('/api/messages', mc.createMessage)
app.get('/api/messages/history', mc.history)

app.listen(process.env.SERVER_PORT, () => {
   console.log(`Listening on port ${process.env.SERVER_PORT}`)
})