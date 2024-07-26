import { combineReducers } from '@reduxjs/toolkit';
import ballsReducer from './balls-slice';

const reducer = combineReducers({
  balls: ballsReducer,
});

export default reducer;
