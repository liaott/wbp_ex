const express = require('express')
const app = express()
const request = require('request')
const router = express.Router({
    // 区分大小写
    caseSensitive: true
})

// app.use(express.logger('dev'))
app.use(express.static('public'))
app.set('views', './public/views/')
// app.engine('html', require('ejs').renderFile)
app.set("view engine", "ejs")

router.use((req, res, next) => {
    next()
})
app.get('/', (req, res, next) => {
    request.get('https://api-m.mtime.cn/PageSubArea/HotPlayMovies.api?locationId=290', (error, apiRes, body) => {
        res.render('index', {data:JSON.parse(body).movies[0]})
    })
})
app.get('/login', (req, res, next) => {
    res.render('login', {data: 1})
})


app.listen(3000, () => {
    console.log('start')
})