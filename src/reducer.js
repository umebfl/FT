import {
    combineReducers,
} from 'redux'

import home from 'SYSWEB/module/home/reducer'
import rc from 'SYSWEB/module/rc/reducer'
import i18n from 'SYSWEB/module/i18n/reducer'

export const AUTH_SIGNOUT = 'redux_auth_signout'

const app_reducer = combineReducers({
    home,
    rc,
    i18n,
})

const rootReducer = (state, action) => {

    // 重置store
    if (action.type === AUTH_SIGNOUT) {
        state = undefined
    }

    return app_reducer(state, action)
}

export default rootReducer
