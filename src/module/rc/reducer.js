import * as R from 'ramda'

import {
    createAction,
    handleActions,
} from 'redux-actions'

import {
    Message,
} from 'antd'

import _fetch from 'SYSWEB/lib/fetch'
import occupational_system from 'SYS/data/职业体系'
import element from 'SYS/data/元素'
import flow from 'SYS/data/流程'
import capital from 'SYS/data/资金分配'
import idea from 'SYS/data/理念'

export const MODULE_KEY = 'rc'

const init_state = {

    occupational_system,
    element,
    flow,
    capital,
    idea,

}

export const action = {

    test: payload => (dispatch, get_state) => {

    },

}

const module_setter = createAction(`${MODULE_KEY}_setter`)

export default handleActions({
    [module_setter]: (state, {payload}) => ({
        ...state,
        ...payload,
    }),
}, init_state)
