import { combineReducers } from '@reduxjs/toolkit';
import ballsReducer from './balls-slice';
import basketReducer from './basket-slice';
import gameSettingsReducer from './game-settings-slice';

const reducer = combineReducers({
  balls: ballsReducer,
  basket: basketReducer,
  gameSettings: gameSettingsReducer,
});

export default reducer;
