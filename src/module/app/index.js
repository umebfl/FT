import React from 'react'

import {
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom'

import Home from 'SYSWEB/module/home'

export default ({children, history}) => (
    <div className='app'>
        <Route exact path='/' render={() => <Redirect to='/home'/>}/>
        <Route path='/home' component={Home}/>
    </div>
)
