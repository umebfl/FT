import * as R from 'ramda'
import React, {Component} from 'react'
import cn from 'classnames'

import {
    bindActionCreators,
} from 'redux'

import {
    connect,
} from 'react-redux'

import {
    action,
} from './reducer'

class Rc extends Component {

    render() {
        const {
            history,
            rc: {
                occupational_system,
            },
            t,
            action,
        } = this.props


        return (
            <div className='rc'>
                123
            </div>
        )
    }
}

export default connect(
    state => ({
        rc: state.rc,
        t: state.i18n.t,
    }),
    dispatch => ({
        action: bindActionCreators(action, dispatch),
    })
)(Rc)
