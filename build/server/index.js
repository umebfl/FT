// 保存
// 提供页面
// 提供数据
// 提供统计分析
const processor = require('process')
const express = require('express')
const webpack = require('webpack')
const request = require('request')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack_config = require('../../webpack.config.js')

const app = express()

// 热加载
const compiler = webpack(webpack_config)
app.use(webpackDevMiddleware(compiler))
app.use(webpackHotMiddleware(compiler))

// 绝对路径
const ABS_PATH = processor.cwd()

// 静态资源文件夹
app.use(express.static('dist'))
app.use(express.static('content'))

app.get('/', (req, res) => {
    res.sendFile(`${ABS_PATH}/dist/index.html`)
})

app.get('/analysis/search', (req, res) => {
    request(`http://hq.sinajs.cn/?list=${req.query.list}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send({
                status: 200,
                data: body,
            })
        }
    })
})




app.listen(3000, () => console.log('server listening on port 3000'))
