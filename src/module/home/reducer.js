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
import expenditure from 'SYS/data/expenditure'
import assets from 'SYS/data/assets'
import cash from 'SYS/data/出入金'

export const MODULE_KEY = 'home'

const init_state = {

    variety,

    assets,
    expenditure,
    cash,

}

const SEARCH_PATH = '/analysis/search'
const SEARCH_LOG_PATH = '/analysis/search_log'
const REFRESH_LOG_PATH = '/analysis/refresh_log'

// 分配
export const DISTRIBUTION_HAQ = 'haq'
export const DISTRIBUTION_HWG = 'hwh'

// 优先级权重
const PRIORITY_WEIGHT = 100

// 价格状态 权重20 计算：Math.abs(50 - 价格状态) / 50 * PRICE_STATE_WEIGHT
const PRICE_STATE_WEIGHT = 10

// 时间段权重
const TIMELINE_WEIGHT = 10

// 波动幅度权重
const FLUCTUATION_RANGE_WEIGHT = 10

// 保证金权重
const BOND_WEIGHT = 10

// 归属权重
const DISTRIBUTION_WEIGHT = 5

// 总权益
const AGGREGATE_INTEREST = 300000

// 最大持仓数  3短 2中 2长
const MAX_HOLD = 7

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

                            // 计算资金配比
                            v => {
                                const weight_count = R.compose(
                                    R.reduce(
                                        (a, b) => a + b.priority,
                                        0
                                    ),
                                    // 只分配7个品种
                                    R.take(MAX_HOLD)
                                )(v)

                                return R.addIndex(R.map)(
                                    (v, k) => {

                                        const fund = k < MAX_HOLD ? parseInt((v.priority / weight_count) * AGGREGATE_INTEREST / 1000) * 1000 : 0

                                        return ({
                                            ...v,
                                            fund,
                                            can_buy: Math.ceil(fund / v.bond),
                                        })
                                    }
                                )(v)
                            },
                            R.sort(
                                (a, b) => b.priority - a.priority
                            ),
                            R.addIndex(R.map)(
                                (v, k) => {

                                    const bond_count = v.bond_count
                                    const lever = v.lever

                                    const info = rv[v.code].info
                                    const closing_price = parseInt(info[10])
                                    const price = parseInt(info[8])

                                    // 波动幅度
                                    const wave = ((price - closing_price) / closing_price * 100).toFixed(2)
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
                                        const nearly_week_rate = Math.ceil(nearly_week / nearly_week_start * 100)

                                        const nearly_month_start = parseInt(all_day[all_day.length - 20][4])
                                        const nearly_month = price - nearly_month_start
                                        const nearly_month_rate = Math.ceil(nearly_month / nearly_month_start * 100)

                                        const nearly_3_month_start = parseInt(all_day[all_day.length - 60][4])
                                        const nearly_3_month = price - nearly_3_month_start
                                        const nearly_3_month_rate = Math.ceil(nearly_3_month / nearly_3_month_start * 100)

                                        const nearly_half_year_start = parseInt(all_day[all_day.length - 120][4])
                                        const nearly_half_year = price - nearly_half_year_start
                                        const nearly_half_year_rate = Math.ceil(nearly_half_year / nearly_half_year_start * 100)

                                        const nearly_year_start = parseInt(all_day[all_day.length - 240][4])
                                        const nearly_year = price - nearly_year_start
                                        const nearly_year_rate = Math.ceil(nearly_year / nearly_year_start * 100)

                                        // 最高价
                                        const price_max = parseInt(R.reduce((a, b) => b[4] !== 0 && a > b[4] ? a : b[4], price_max)(all_day))
                                        // 最低价
                                        const price_min = parseInt(R.reduce((a, b) => b[4] !== 0 && a > b[4] ? b[4] : a, price_max)(all_day))

                                        // 价格状态
                                        const price_state = Math.ceil((price - price_min) / (price_max - price_min) * 100)

                                        // 资金状态权重
                                        const weight_price_state = parseInt(Math.abs(50 - price_state) / 50 * PRICE_STATE_WEIGHT)

                                        // 时间段状态权重
                                        const weight_timeline = get_timeline_weight(nearly_year, nearly_half_year, nearly_3_month, nearly_month, nearly_week)

                                        // 波动幅度权重
                                        const weight_fluctuation_range = get_fluctuation_range_weight(nearly_year_rate, nearly_half_year_rate, nearly_3_month_rate, nearly_month_rate, nearly_week_rate)

                                        // 保证金比例
                                        const weight_bond = get_bond_weight(lever)

                                        const weight_distribution = v.distribution === DISTRIBUTION_HAQ ? DISTRIBUTION_WEIGHT : 0

                                        // 优先级
                                        const priority = get_priority(weight_price_state, weight_timeline, weight_fluctuation_range, weight_bond, weight_distribution)


                                        all_day_analy = {

                                            weight_price_state,
                                            weight_timeline,
                                            weight_fluctuation_range,
                                            weight_bond,
                                            weight_distribution,

                                            priority,

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

                                            // 近一年 多空
                                            nearly_year_rate: nearly_year_rate,
                                            nearly_year_str: nearly_year < 0 ? '空' : '多',
                                            nearly_year: nearly_year,

                                            // 近半年 多空
                                            nearly_half_year_rate: Math.ceil(nearly_half_year / nearly_half_year_start * 100),
                                            nearly_half_year_str: nearly_half_year < 0 ? '空' : '多',
                                            nearly_half_year: nearly_half_year,

                                            // 近一月 多空
                                            nearly_3_month_rate: Math.ceil(nearly_3_month / nearly_3_month_start * 100),
                                            nearly_3_month_str: nearly_3_month < 0 ? '空' : '多',
                                            nearly_3_month: nearly_3_month,

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
                                        closing_price,
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

// 获取波动幅度权重
const get_fluctuation_range_weight = (nearly_year_rate, nearly_half_year_rate, nearly_3_month_rate, nearly_month_rate, nearly_week_rate) => {

    let weight = 0

    // const count = Math.abs(nearly_year_rate) + Math.abs(nearly_half_year_rate) + Math.abs(nearly_3_month_rate) + Math.abs(nearly_month_rate) + Math.abs(nearly_week_rate)
    //
    //
    // if(count < 20) {    // 0 - 20
    //     weight = 0.2
    // } else if(count > 20 && count < 40) { // 20 - 40
    //     weight = 0.4
    // } else if(count > 40 && count < 60) { // 40 - 60
    //     weight = 0.6
    // } else if(count > 60 && count < 70) { // 60 - 70
    //     weight = 0.8
    // } else {                // 70以上
    //     weight = 1
    // }

    // 最高 最低差距
    const list = [nearly_year_rate, nearly_half_year_rate, nearly_3_month_rate, nearly_month_rate, nearly_week_rate]

    const count = R.compose(
        v => {
            return v[0] > 0 ? v[0] + Math.abs(v[v.length - 1]) : Math.abs(v[v.length - 1]) - Math.abs(v[0])
        },
        R.sort(
            (a, b) => b - a
        )
    )(list)

    if(count <= 10) {
        weight = 0.2
    } else if(count > 10 && count <= 15) {
        weight = 0.4
    } else if(count > 15 && count <= 20) {
        weight = 0.6
    } else if(count > 20 && count <= 25) {
        weight = 0.8
    } else {
        weight = 1
    }

    // console.log(list, count, weight, weight * FLUCTUATION_RANGE_WEIGHT)

    return weight * FLUCTUATION_RANGE_WEIGHT
}

// 获取时间段走势权重
const get_timeline_weight = (nearly_year, nearly_half_year, nearly_3_month, nearly_month, nearly_week) => {

    let weight = 0

    // let series_positive = 0
    // let series_negative = 0
    //
    // R.map(
    //     v => {
    //         if(v > 0) {
    //             series_positive++
    //             series_negative = 0
    //         } else {
    //             series_negative++
    //             series_positive = 0
    //         }
    //     }
    // )([nearly_year, nearly_half_year, nearly_3_month, nearly_month, nearly_week])
    //
    // if(series_positive === 5 || series_negative === 5) {
    //     weight = 1
    // } else if(series_positive === 4 || series_negative === 4) {
    //     weight = 0.8
    // } else if(series_positive === 3 || series_negative === 3) {
    //     weight = 0.6
    // }

    // 正正正正正 || 反反反反反
    if(nearly_year >= 0 && nearly_half_year >= 0 && nearly_3_month >= 0 && nearly_month >= 0 && nearly_week >= 0) {
        weight = 0.6
    } else if(nearly_year <= 0 && nearly_half_year <= 0 && nearly_3_month <= 0 && nearly_month <= 0 && nearly_week <= 0) {
        weight = 0.6
    }

    // 正正正正反 || 反反反反正
    if(nearly_year >= 0 && nearly_half_year >= 0 && nearly_3_month >= 0 && nearly_month >= 0 && nearly_week <= 0) {
        weight = 0.8
    } else if(nearly_year <= 0 && nearly_half_year <= 0 && nearly_3_month <= 0 && nearly_month <= 0 && nearly_week >= 0) {
        weight = 0.8
    }

    // 正正正反反 || 反反正正正 || 反反反正正 || 正正反反反
    if(nearly_year >= 0 && nearly_half_year >= 0 && nearly_3_month >= 0 && nearly_month <= 0 && nearly_week <= 0) {
        weight = 0.8
    } else if(nearly_year <= 0 && nearly_half_year <= 0 && nearly_3_month >= 0 && nearly_month >= 0 && nearly_week >= 0) {
        weight = 0.8
    } else if(nearly_year <= 0 && nearly_half_year <= 0 && nearly_3_month <= 0 && nearly_month >= 0 && nearly_week >= 0) {
        weight = 0.8
    } else if(nearly_year >= 0 && nearly_half_year >= 0 && nearly_3_month <= 0 && nearly_month <= 0 && nearly_week <= 0) {
        weight = 0.8
    }

    return weight * TIMELINE_WEIGHT
}

// 获取保证金权重
const get_bond_weight = (lever) => {

    let weight = 0.2

    if(lever > 7) {
        weight = 0.4

        if(lever > 8) {
            weight = 0.6

            if(lever > 9) {
                weight = 0.8

                if(lever > 10) {
                    weight = 1
                }
            }
        }
    }

    return weight * BOND_WEIGHT
}

// 获取优先级权重
const get_priority = (weight_price_state, weight_timeline, weight_fluctuation_range, weight_bond, weight_distribution) => {

    return weight_price_state + weight_timeline + weight_fluctuation_range + weight_bond + weight_distribution
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
