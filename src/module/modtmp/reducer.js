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

export const MODULE_KEY = 'rc'

const init_state = {

    occupational_system,

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
