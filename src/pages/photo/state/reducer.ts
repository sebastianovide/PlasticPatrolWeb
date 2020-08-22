import type { State, Action } from "./types";
import actionTypes from "./actionTypes";

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case actionTypes.SET_RAW_DATA:
      return {
        ...state,
        rawData: action.payload
      };
    case actionTypes.SET_PROCESSED_DATA: {
      return { ...state, processedData: action.payload };
    }
    case actionTypes.SET_LOCATION: {
      const { ...newState } = state;

      newState.processedData.imgLocation = action.payload;

      return newState;
    }
    default:
      return state;
  }
}
