import React, {
    Component,
    PropTypes,
} from 'react'

import {
    bindActionCreators,
} from 'redux'

import {
    connect,
} from 'react-redux'

import {
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom'

import {
    ConfigProvider,
} from 'antd'

import zh_CN from 'antd/lib/locale-provider/zh_CN'
import en from 'antd/lib/locale-provider/en_US'

import {
    LANG_EN,
    LANG_ZHCN,
} from 'SYSWEB/module/i18n/reducer'

import App from 'SYSWEB/module/app'

import {
    action as i18n_action,
} from './module/i18n/reducer'

class Router extends Component {

    constructor(prop) {
        super(prop)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.lang !== nextProps.lang) {
            this.props.action.i18n_change_lang(nextProps.lang)
        }

        return true
    }

    render() {
        const {
            lang,
        } = this.props

        return (
            <ConfigProvider locale={lang === LANG_ZHCN ? zh_CN : en}>
                <HashRouter>
                    <Route path='/' component={App}/>
                </HashRouter>
            </ConfigProvider>
        )
    }
}

export default connect(
    state => ({
        t: state.i18n.t,
        lang: state.i18n.lang,
    }),
    dispatch => ({
        action: bindActionCreators(i18n_action, dispatch),
    })
)(Router)
