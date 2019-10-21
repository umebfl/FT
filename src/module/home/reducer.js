import * as R from 'ramda'

import {
    createAction,
    handleActions,
} from 'redux-actions'

import {
    Message,
} from 'antd'

import _fetch from 'SYSWEB/lib/fetch'
import variety from 'SYS/data/variety'

export const MODULE_KEY = 'home'

const init_state = {

    variety,

}

const SEARCH_PATH = '/analysis/search'
const SEARCH_LOG_PATH = '/analysis/search_log'
const REFRESH_LOG_PATH = '/analysis/refresh_log'

export const action = {

    reflush_log: payload => (dispatch, get_state) => {
        const state = get_state()
        const module_state = state[MODULE_KEY]

        const list = R.compose(
            R.join(','),
            R.map(rv => rv.code)
        )(variety)

        _fetch({
            state,
            module_state,
            method: 'GET',
            path: REFRESH_LOG_PATH,
            param: {
                list,
            },
            success: rv => {
                // Message.success('刷新成功')
                // 重新刷新
                payload.callback()
            },
        })
    },

    search: payload => (dispatch, get_state) => {
        const state = get_state()
        const module_state = state[MODULE_KEY]

        const list = R.compose(
            R.join(','),
            R.map(rv => `${rv.code}${rv.month}`)
        )(module_state.variety)

        const list_code = R.compose(
            R.join(','),
            R.map(rv => `${rv.code}`)
        )(module_state.variety)

        _fetch({
            state,
            module_state,
            method: 'GET',
            path: SEARCH_PATH,
            param: {
                list,
                list_code,
            },
            success: rv => {
                const state = get_state()
                const module_state = state[MODULE_KEY]
                const variety = module_state.variety

                dispatch(
                    module_setter({
                        variety: R.compose(
                            R.sort(
                                (a, b) => a.price_state - b.price_state
                            ),
                            R.addIndex(R.map)(
                                (v, k) => {

                                    const bond_count = v.bond_count
                                    const lever = v.lever

                                    const info = rv[v.code].info
                                    const opening_price = parseInt(info[2])
                                    const price = parseInt(info[8])

                                    // 波动幅度
                                    const wave = ((price - opening_price) / opening_price * 100).toFixed(2)
                                    const bond = parseInt(price * bond_count / lever)

                                    //[0] 日期
                                    //[1] 开盘
                                    //[2] 最低
                                    //[3] 最高
                                    //[4] 收盘
                                    //[5] 成交
                                    const all_day = rv[v.code].all_day || []

                                    let all_day_analy = {}

                                    if(all_day.length) {
                                        const nearly_week_start = parseInt(all_day[all_day.length - 6][4])
                                        const nearly_week = price - nearly_week_start

                                        const nearly_month_start = parseInt(all_day[all_day.length - 20][4])
                                        const nearly_month = price - nearly_month_start

                                        const nearly_half_year_start = parseInt(all_day[all_day.length - 120][4])
                                        const nearly_half_year = price - nearly_half_year_start

                                        // 最高价
                                        const price_max = parseInt(R.reduce((a, b) => b[4] !== 0 && a > b[4] ? a : b[4], price_max)(all_day))
                                        // 最低价
                                        const price_min = parseInt(R.reduce((a, b) => b[4] !== 0 && a > b[4] ? b[4] : a, price_max)(all_day))

                                        const price_state = Math.ceil((price - price_min) / (price_max - price_min) * 100)

                                        all_day_analy = {

                                            price_max,
                                            price_min,

                                            // 价格状态  (4当前 - 2最低) / (10最高 - 2最低) * 100
                                            price_state_str: R.cond([
                                                [
                                                    v => v < 20,
                                                    v => '低位',
                                                ],
                                                [
                                                    v => v < 40,
                                                    v => '中低位',
                                                ],
                                                [
                                                    v => v < 60,
                                                    v => '中位',
                                                ],
                                                [
                                                    v => v < 80,
                                                    v => '中高位',
                                                ],
                                                [
                                                    R.T,
                                                    v => '高位',
                                                ],
                                            ])(price_state),

                                            price_state,

                                            // 近半年 多空
                                            nearly_half_year_rate: Math.ceil(nearly_half_year / nearly_half_year_start * 100),
                                            nearly_half_year_str: nearly_half_year < 0 ? '空' : '多',
                                            nearly_half_year: nearly_half_year,

                                            // 近一月 多空
                                            nearly_month_rate: Math.ceil(nearly_month / nearly_month_start * 100),
                                            nearly_month_str: nearly_month < 0 ? '空' : '多',
                                            nearly_month: nearly_month,

                                            // 近一周 多空
                                            nearly_week_rate: Math.ceil(nearly_week / nearly_week_start * 100),
                                            nearly_week_str: nearly_week < 0 ? '空' : '多',
                                            nearly_week: nearly_week,
                                        }
                                    }

                                    return ({
                                        ...v,
                                        price,
                                        opening_price,
                                        wave,
                                        bond,
                                        all_day,
                                        ...all_day_analy,
                                    })
                                }
                            )
                        )(variety),
                    })
                )

            },
        })

    },

}

const module_setter = createAction('home_setter')

export default handleActions({
    [module_setter]: (state, {payload}) => ({
        ...state,
        ...payload,
    }),
}, init_state)


// console.log(
//     CLEAR_CODE,
//     // info,
//     `开盘价: ${info[2]}\n`,
//     `最高价: ${info[3]}\n`,
//     `最低价: ${info[4]}\n`,
//     `昨日收盘价: ${info[5]}\n`,
//     `最新价: ${info[8]}\n`,
//     `结算价: ${info[9]}\n`,
//     `昨结算: ${info[10]}\n`,
//     `买一价: ${info[6]}\n`,
//     `卖一价: ${info[7]}\n`,
//     `买量: ${info[11]}\n`,
//     `卖量: ${info[12]}\n`,
//     `持仓量: ${info[13]}\n`,
//     `成交量: ${info[14]}\n`,
//     `${interval_count}`.grey,
//     `${text}`.grey,
//     `${average}`.grey,  // 监控时间段内平均
//     `${price_margin}`.grey,  // 上一间隔价差
//     quick ? `${quick_price_margin}`.red : `${quick_price_margin}`.grey  // INTERVAL * QUICK_INTERVAL 秒内价差
// )
