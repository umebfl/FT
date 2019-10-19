import {
    createStore,
    applyMiddleware,
    compose,
} from 'redux'

import {
    persistStore,
    autoRehydrate,
} from 'redux-persist'

// import createCompressor from 'redux-persist-transform-compress'
// import createEncryptor from 'redux-persist-transform-encrypt'
import {
    createFilter,
    // createBlacklistFilter,
} from 'redux-persist-transform-filter'

import conf, {
    DEV,
    PRO,
} from '../conf'

import rootReducer from './reducer.js'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

export default function configureStore(onCompletion) {

    let enhancer

    if(conf.env === PRO) {
        enhancer = compose(
            applyMiddleware(thunk),
            autoRehydrate()
        )
    } else {
        enhancer = compose(
            // applyMiddleware(thunk),
            applyMiddleware(thunk, logger),
            autoRehydrate()
        )
    }

    // if(module.hot) {
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept('./reducer.js', () => {
    //         const nextReducer = require('./reducer.js').default
    //         store.replaceReducer(nextReducer)
    //     })
    // }

    const store = createStore(rootReducer, enhancer)

    // 压缩
    // const compressor = createCompressor()
    // 加密
    // const asyncEncryptor = createEncryptor({
    //     secretKey: 'ume is butterfly',
    // })
    // 过滤
    const whitelist = [
        'i18n',
        // 'analysis',
        'weekly_selection',
        'capital',
        'transaction',
        // 'home',
        // 'user_info',
        // 'role',
    ]
    // const saveSubsetFilterBlack = createBlacklistFilter(
    //     'home',
    //     ['structure', 'show_left_nav', 'selected_key', 'show_head']
    // )
    const saveSubsetFilterWhite_i18n = createFilter(
        'i18n',
        ['lang']
    )
    const saveSubsetFilterWhite_weekly_selection = createFilter(
        'weekly_selection',
        ['data']
    )
    // const saveSubsetFilterWhite_analysis = createFilter(
    //     'analysis',
    //     ['data']
    // )
    const saveSubsetFilterWhite_transaction = createFilter(
        'transaction',
        ['data', 'cleared_data']
    )

    // const saveSubsetFilterWhite = createFilter(
    //     'target_personal_list',
    //     ['columnDefs', 'paginationPageSize']
    // )
    // const target_personal_add_save = createFilter(
    //     'target_personal_add',
    //     ['form', 'row_data']
    // )

    persistStore(store, {
        whitelist,
        transforms: [
            saveSubsetFilterWhite_i18n,
            saveSubsetFilterWhite_weekly_selection,
            // saveSubsetFilterWhite_analysis,
            saveSubsetFilterWhite_transaction,
            // saveSubsetFilterBlack,
            // saveSubsetFilterWhite,
            // target_personal_add_save,
            // saveSubsetFilterWhite2,
            // asyncEncryptor,
            // compressor,
        ],
    }, onCompletion)

    // return store
    return store
}
