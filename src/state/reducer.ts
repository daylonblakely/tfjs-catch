import { combineReducers } from '@reduxjs/toolkit';
import ballsReducer from './balls-slice';
import basketReducer from './basket-slice';

const reducer = combineReducers({
  balls: ballsReducer,
  basket: basketReducer,
});

export default reducer;
