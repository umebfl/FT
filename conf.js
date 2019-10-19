const processor = require('process')

// 绝对路径
const ABS_PATH = processor.cwd()

// 开发环境
const DEV = 'development'
// 正式环境
const PRO = 'production'

// 环境
const env = DEV // DEV PRO

const conf = {
    // 应用版本号
    version: '0.0.1',

    // 工程路径
    pro_path: ABS_PATH,

    // 目标路径
    dist_path: `${ABS_PATH}/dist`,

    // 运行环境
    env,

    // 构建时间
    bundle_time: env === DEV ? '' : `${new Date().getMonth() + 1}${new Date().getDate()}${new Date().getHours()}`,

    server: {
        host: '.',
    },
}

module.exports.DEV = DEV
module.exports.PRO = PRO
module.exports.conf = conf
