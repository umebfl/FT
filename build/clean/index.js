import del from 'del'

import conf from '../../conf.js'

// 文件清理
export default function() {
    return del([
        `${conf.dist_path}/*`,
        // `${conf.pro_path}/npm-debug.log`,
    ], {
        force: false,    // 删除工程外部权限
    })
}
