
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
const composeParams = [];
composeParams.push(applyMiddleware(thunk))
if (window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.NODE_ENV!=='production') {
    composeParams.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}


const store = createStore(rootReducer, compose(...composeParams))


export  default  store;