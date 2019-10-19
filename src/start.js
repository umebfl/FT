import React from 'react'
import ReactDOM from 'react-dom'

import {
    Provider,
} from 'react-redux'

import configureStore from './store'
import Root from './router'

window.onload = () => {
    ReactDOM.render(
        <Provider store={configureStore()}>
            <Root/>
        </Provider>,
        document.getElementById('Workspace')
    )
}
