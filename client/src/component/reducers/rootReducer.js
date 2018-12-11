import {combineReducers} from 'redux'
import { authenticationReducer } from './authenticationReducer'
import { errorsReducer } from './errorsReducer'
import modalReducer from './modalReducer'


const rootReducer = combineReducers({
  authenticate:authenticationReducer,
  errors:errorsReducer,
  modal:modalReducer
})

export default rootReducer
