// 保存
// 提供页面
// 提供数据
// 提供统计分析
const processor = require('process')
const express = require('express')
const webpack = require('webpack')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack_config = require('../../webpack.config.js')

const weekly_selection = require('./module/weekly_selection')


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

// app.get('/weekly_selection/search', weekly_selection.search)
// app.post('/weekly_selection/add', weekly_selection.add)

app.listen(3000, () => console.log('server listening on port 3000'))
