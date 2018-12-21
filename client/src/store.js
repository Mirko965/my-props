import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './component/reducers/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = [thunk]
const initialState = {}
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });


const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
)

export default store
