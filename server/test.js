const express = require('express');
const app = express();

app.get('/', (rqe, res, next) => {
    res.send('Hello World!')
})

app.get('/about/:id', (req, res, next) => {
    res.json(req.params)
    console.log('Before next')
    next()
    console.log('after next')
})


app.listen(3000, () => console.log('Listening on port 3000'));