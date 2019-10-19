import * as R from 'ramda'

import {
    get_parse_param,
    is_uri_param,
} from 'SYSWEB/lib/url'

import {
    Message,
} from 'antd'

import {
    DEV,
    PRO,
    conf,
} from 'SYS/conf.js'

const TIMEOUT_SEC = 30 * 1000
const DEFAULT_METHOD = 'GET'

const init_fetch_state = {
    _fetch_status: 'fetch_inited',
    _fetch_loading: false,
    _fetch_error: false,
    _fetch_success: false,
    _fetch_timeout: false,
}

// 生成请求头
export const get_fetch_header = (fetch_type, is_upload, lang, env) => ({
    'Accept-Language': lang,
    'Content-Type': R.ifElse(
        v => is_uri_param(v),
        R.always('Content-Type:text/html'),
        // R.always('Content-Type:text/plain'),
        R.ifElse(
            () => is_upload,
            R.always('multipart/form-data'),
            R.always('application/x-www-form-urlencoded')
        )
    )(fetch_type),
})

// 生成请求body
export const get_fetch_body = (fetch_type, param, is_upload) => {
    if(is_upload) {
        return param
    }

    if(is_uri_param(fetch_type)) {
        return null
    }

    return get_parse_param(param)
}

// 生成请求url
export const get_fetch_url = (fetch_type, host, path, param) => {
    const url = `${host}${path}`

    if(is_uri_param(fetch_type)) {
        return `${url}?${get_parse_param(param)}`
    } else {
        return url
    }
}

// 执行fetch请求
const _fetch = prop => {
    const {
        state: {        // store
            i18n: {
                lang,
                t,
            },
            user_info,
        },
        module_state,   // 模块数据
        method = DEFAULT_METHOD,         // 请求类型  GET ／ POST
        is_upload,      // 文件上传类型请求
        host,
        host_hrs,   // true
        path,
        param,
        path_name,      // 接口名称
        success,
        set_state = () => {},
        error,
        error_flow,
    } = prop

    let rv
    let finish
    let timeouted
    let real_host = conf.server.host

    const url = get_fetch_url(method, real_host, path, param)

    console.log('fetch | url:', url, param)

    // 启动加载中状态
    set_state({
        ...init_fetch_state,
        _fetch_status: 'fetch_start',
        _fetch_loading: true,
    })

    // 超时
    setTimeout(() => {
        if(!finish) {
            set_state({
                ...init_fetch_state,
                _fetch_status: 'fetch_timeout',
                _fetch_timeout : true,
            })

            Message.error(t['i18n-网络连接超时'])
            error_flow && error_flow()
            timeouted = true
        }
    }, TIMEOUT_SEC)

    fetch(
        url,
        {
            credentials: 'include',
            method: method,
            headers: get_fetch_header(method, is_upload, lang, conf.env),
            body: get_fetch_body(method, param, is_upload),
        }
    ).then(
        rv => rv.json()
    ).then(rv => {
        set_state({
            ...init_fetch_state,
            _fetch_status: 'fetch_success',
            _fetch_success: true,
        })

        finish = true

        if(rv.status === 200) {
            success && success(rv.data)

            // conf.env === DEV && console.log('rv', url, rv.data)
        } else {
            if(error) {
                error(rv)
            } else {
                Message.error(rv.data ? rv.data : t['i18n-请求数据异常'])
                error_flow && error_flow(rv)
            }
        }
    }).catch(function(e) {

        if(error) {
            error(t['i18n-数据连接异常'])
        } else {
            Message.error(t['i18n-数据连接异常'])
        }

        console.log('error:', e)

        set_state({
            ...init_fetch_state,
            _fetch_status: 'fetch_error',
            _fetch_error : true,
        })
    })
}

export default _fetch
