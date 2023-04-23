import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import chatReducer from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store