import type { State, Action } from "./types";

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_FILE":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
