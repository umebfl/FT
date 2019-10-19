import R from 'ramda'

import {
    createAction,
    handleActions,
} from 'redux-actions'

import _fetch from 'SYSWEB/lib/fetch'

export const MODULE_KEY = 'home'

const init_state = {

    data: {},

}

const SEARCH_PATH = '/analysis/search'

export const action = {

    search: payload => (dispatch, get_state) => {
        const state = get_state()
        const module_state = state[MODULE_KEY]

        _fetch({
            state,
            module_state,
            method: 'GET',
            path: SEARCH_PATH,
            param: {
                list: 'AG1912,TA1912',
            },
            success: rv => {
                const item = R.compose(
                    R.dropLast(1),
                    R.map(
                        R.split(',')
                    ),
                    R.split(';')
                )(rv)

                dispatch(
                    module_setter({
                        data: item,
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
