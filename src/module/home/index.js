import R from 'ramda'
import React, {Component} from 'react'

import {
    bindActionCreators,
} from 'redux'

import {
    connect,
} from 'react-redux'

import {
    action,
} from './reducer'

class Home extends Component {

    componentDidMount() {
        this.props.action.search()
    }

    render() {
        const {
            history,
            home,
            t,
        } = this.props

        return (
            <div className='home'>

            </div>
        )
    }
}

export default connect(
    state => ({
        home: state.home,
        t: state.i18n.t,
    }),
    dispatch => ({
        action: bindActionCreators(action, dispatch),
    })
)(Home)
