import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { Tracker } from 'meteor/tracker'

import Login from '../ui/pages/Login'
import Register from '../ui/pages/Register'
import UserAccount from '../ui/pages/UserAccount'
import TransactionHistory from '../ui/pages/TransactionHistory'

const history = createHistory();
const unAuthenticatedPages = ['/', '/register', '/transactions']
const authenticatedPages = ['/user']

const NotFoundPage = () => (
    <div>
        Page Not Found! 404!
    </div>
)

const onEnterPublicPage = () => {
    if(Meteor.userId())
        history.replace("/user")
}

const onEnterPrivatePage = () => {
    if(!Meteor.userId())
        history.replace("/")
}

const AppRouter = () => (
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={Login} onEnter={onEnterPublicPage}></Route>
            <Route path='/register' component={Register} onEnter={onEnterPublicPage}></Route>
            <Route path='/user' component={UserAccount} onEnter={onEnterPrivatePage}></Route>
            <Route path='/transactions' component={TransactionHistory} onEnter={onEnterPublicPage}></Route>
            <Route component={NotFoundPage}></Route>
        </Switch>
    </Router>
)

Tracker.autorun(() => {
    const isAuthenticated = !!Meteor.userId();
    const pathname = history.location.pathname;
    const isUnauthenticatedPage = unAuthenticatedPages.includes(pathname)
    const isAuthenticatedPage = authenticatedPages.includes(pathname)

    if(isUnauthenticatedPage && isAuthenticated){
        history.replace("/user")
    }
    else if(isAuthenticatedPage && !isAuthenticated){
        history.replace("/")
    }
})

export default AppRouter