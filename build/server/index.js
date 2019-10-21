// 保存
// 提供页面
// 提供数据
// 提供统计分析
const processor = require('process')
const express = require('express')
const webpack = require('webpack')
const request = require('request')
const R = require('ramda')

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

// 缓存数据
let ft_log = {}


app.get('/', (req, res) => {
    res.sendFile(`${ABS_PATH}/dist/index.html`)
})

app.get('/analysis/search', (req, res) => {
    get_info_log(req, res)
})

app.get('/analysis/search_log', (req, res) => {
    request(`http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=${req.query.code}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send({
                status: 200,
                data: body,
            })
        }
    })
})

app.get('/analysis/refresh_log', (req, res) => {
    const list = req.query.list.split(',')

    get_all_day_log(list, res)
})

// 请求当前数据
function get_info_log(req, res) {

    const list = req.query.list
    const list_code = req.query.list_code

    request(`http://hq.sinajs.cn/?list=${list}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const list_code_arr = list_code.split(',')
            const item_arr = body.split(';')

            for(var i = 0; i < list_code_arr.length; i++) {
                const item = item_arr[i]
                let info = item.split(',')
                let key = list_code_arr[i]

                info.pop()

                ft_log[key] = {
                    ...ft_log[key],
                    info,
                }
            }

            res.send({
                status: 200,
                data: ft_log,
            })
        }
    })
}

// 请求全部日数据
function get_all_day_log(list, res) {
    let finish_count = 0

    for (var i = 0; i < list.length; i++) {
        const code = list[i]

        request(`http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=${code}0`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // 解析文本
                const all_day_str = JSON.parse(body)

                const all_day = R.compose(
                    R.map(
                        R.addIndex(R.map)(
                            (v, k) => k === 0 ? v : parseInt(v)
                        ),
                    ),
                    // 只要前2.5年600天
                    R.takeLast(600)
                )(all_day_str)

                // 缓存数据
                ft_log[code] = {
                    ...ft_log[code],
                    all_day,
                }

                finish_count++

                if(finish_count === list.length) {
                    res.send({
                        status: 200,
                        data: finish_count,
                    })
                }
            }
        })
    }
}



app.listen(3000, () => console.log('server listening on port 3000'))
