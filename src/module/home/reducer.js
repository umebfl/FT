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
                        variety: R.addIndex(R.map)(
                            (v, k) => {

                                const bond_count = v.bond_count
                                const lever = v.lever

                                const info = rv[v.code].info
                                const price = parseInt(info[8])
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
                                    const nearly_week_end = parseInt(all_day[all_day.length - 1][4])
                                    const nearly_week = nearly_week_end - nearly_week_start

                                    const nearly_month_start = parseInt(all_day[all_day.length - 20][4])
                                    const nearly_month_end = parseInt(all_day[all_day.length - 1][4])
                                    const nearly_month = nearly_month_end - nearly_month_start

                                    const nearly_half_year_start = parseInt(all_day[all_day.length - 120][4])
                                    const nearly_half_year_end = parseInt(all_day[all_day.length - 1][4])
                                    const nearly_half_year = nearly_half_year_end - nearly_half_year_start

                                    all_day_analy = {
                                        // 近半年 多空
                                        nearly_half_year_rate: (nearly_half_year / nearly_half_year_start * 100).toFixed(2),
                                        nearly_half_year_str: nearly_half_year < 0 ? '空' : '多',
                                        nearly_half_year: nearly_half_year,

                                        // 近一月 多空
                                        nearly_month_rate: (nearly_month / nearly_month_start * 100).toFixed(2),
                                        nearly_month_str: nearly_month < 0 ? '空' : '多',
                                        nearly_month: nearly_month,

                                        // 近一周 多空
                                        nearly_week_rate: (nearly_week / nearly_week_start * 100).toFixed(2),
                                        nearly_week_str: nearly_week < 0 ? '空' : '多',
                                        nearly_week: nearly_week,
                                    }
                                }

                                return ({
                                    ...v,
                                    price,
                                    bond,
                                    all_day,
                                    ...all_day_analy,
                                })
                            }
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
