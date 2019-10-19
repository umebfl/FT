import * as R from 'ramda'

import {
    createAction,
    handleActions,
} from 'redux-actions'

import _fetch from 'SYSWEB/lib/fetch'
import variety from 'SYS/data/variety'

console.log(variety)

export const MODULE_KEY = 'home'

const init_state = {

    variety,

}

const SEARCH_PATH = '/analysis/search'
const SEARCH_LOG_PATH = '/analysis/search_log'

export const action = {

    search: payload => (dispatch, get_state) => {
        const state = get_state()
        const module_state = state[MODULE_KEY]

        const list = R.compose(
            R.join(','),
            R.map(rv => `${rv.code}${rv.month}`)
        )(module_state.variety)

        _fetch({
            state,
            module_state,
            method: 'GET',
            path: SEARCH_PATH,
            param: {
                list,
            },
            success: rv => {
                const state = get_state()
                const module_state = state[MODULE_KEY]
                const variety = module_state.variety

                const item = R.compose(
                    R.dropLast(1),
                    R.map(
                        R.split(',')
                    ),
                    R.split(';')
                )(rv)

                dispatch(
                    module_setter({
                        variety: R.addIndex(R.map)(
                            (v, k) => {

                                const bond_count = v.bond_count
                                const lever = v.lever

                                const info = item[k]
                                const price = parseInt(info[8])
                                const bond = parseInt(price * bond_count / lever)

                                return ({
                                    ...v,
                                    price,
                                    bond,
                                })
                            }
                        )(variety),
                    })
                )

                // 请求日志数据
                R.addIndex(R.map)(
                    (v, k) => {

                        _fetch({
                            state,
                            module_state,
                            method: 'GET',
                            path: SEARCH_LOG_PATH,
                            param: {
                                // code: `${v.code}0`,
                                code: `${v.code}${v.month}`,
                            },
                            success: rv => {
                                const state = get_state()
                                const module_state = state[MODULE_KEY]
                                const variety = module_state.variety

                                const log = JSON.parse(rv)
                                //[0] 日期
                                //[1] 开盘
                                //[2] 最低
                                //[3] 最高
                                //[4] 收盘
                                //[5] 成交
                                const nearly_week_start = parseInt(log[log.length - 6][4])
                                const nearly_week_end = parseInt(log[log.length - 1][4])
                                const nearly_week = nearly_week_end - nearly_week_start

                                const nearly_month_start = parseInt(log[log.length - 20][4])
                                const nearly_month_end = parseInt(log[log.length - 1][4])
                                const nearly_month = nearly_month_end - nearly_month_start

                                const nearly_half_year_start = parseInt(log[log.length - 120][4])
                                const nearly_half_year_end = parseInt(log[log.length - 1][4])
                                const nearly_half_year = nearly_half_year_end - nearly_half_year_start

                                dispatch(
                                    module_setter({
                                        variety: R.adjust(
                                            k,
                                            R.compose(

                                                // 近半年 多空
                                                R.assoc(
                                                    'nearly_half_year_rate', (nearly_half_year / nearly_half_year_start * 100).toFixed(2),
                                                ),
                                                R.assoc(
                                                    'nearly_half_year_str', nearly_half_year < 0 ? '空' : '多',
                                                ),
                                                R.assoc(
                                                    'nearly_half_year', nearly_half_year,
                                                ),

                                                // 近一月 多空
                                                R.assoc(
                                                    'nearly_month_rate', (nearly_month / nearly_month_start * 100).toFixed(2),
                                                ),
                                                R.assoc(
                                                    'nearly_month_str', nearly_month < 0 ? '空' : '多',
                                                ),
                                                R.assoc(
                                                    'nearly_month', nearly_month,
                                                ),

                                                // 近一周 多空
                                                R.assoc(
                                                    'nearly_week_rate', (nearly_week / nearly_week_start * 100).toFixed(2),
                                                ),
                                                R.assoc(
                                                    'nearly_week_str', nearly_week < 0 ? '空' : '多',
                                                ),
                                                R.assoc(
                                                    'nearly_week', nearly_week,
                                                ),
                                                R.assoc(
                                                    'log', log
                                                )
                                            )
                                        )(variety),
                                    })
                                )
                            },
                        })
                    }
                )(module_state.variety)
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
