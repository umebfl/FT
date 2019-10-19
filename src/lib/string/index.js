import * as R from 'ramda'
import React, {Component} from 'react'

export const string_format_position = (str, num, color) => {

    let prefix = ''
    let rv = str + ''

    if(rv.length < num) {
        for(let i = 0; i < num - rv.length; i++) {
            prefix += ' '
        }
    }

    return (
        <span style={{display: 'inline-block', width: 10 * num, textAlign: 'right'}}>
            {prefix}
            {rv}
        </span>
    )
}
