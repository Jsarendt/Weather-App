const path = require('path')
const express = require('express')

const app = express(),

			
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})