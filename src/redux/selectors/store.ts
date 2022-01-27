import {combineReducers} from 'redux';
import {practiceLogReducer} from '../reducers/practiceLogReducer';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

export const rootReducer = combineReducers({
  practiceLogReducer: practiceLogReducer,
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunk));
