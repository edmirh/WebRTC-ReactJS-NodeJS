const express = require('express');
const app = express();

app.get('/', (rqe, res, next) => {
    res.send('Hello World!')
})

app.get('/about', (req, res, next) => {
    res.json([1,2,3])
    console.log('Before next')
    next()
})


app.listen(3000, () => console.log('Listening on port 3000'));