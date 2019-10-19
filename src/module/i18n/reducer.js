import * as R from 'ramda'

import {
    createAction,
    handleActions,
} from 'redux-actions'

import resource from './local'

export const LANG_EN = 'en'
export const LANG_ZHCN = 'zh-CN'

export const lang_list = [
    {
        key: LANG_ZHCN,
        val: 'i18n-中文',
    },
    {
        key: LANG_EN,
        val: 'i18n-英语',
    },
]

export const MODULE_KEY = 'i18n'

const init_state = {
    lang: LANG_ZHCN,
    t: resource[LANG_ZHCN],
}

export const action = {
    i18n_change_lang: payload => (dispatch, get_state) => {
        const state = get_state()
        const module_state = state[MODULE_KEY]

        let lang = payload ? payload : LANG_ZHCN

        dispatch(
            module_setter({
                lang,
                t: resource[lang],
            })
        )
    },
}

const module_setter = createAction('i18n_setter')

export default handleActions({
    [module_setter]: (state, {payload}) => ({
        ...state,
        ...payload,
    }),
}, init_state)
