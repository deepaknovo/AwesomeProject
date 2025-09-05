import React, {createContext, useReducer, ReactNode} from 'react';

type MappedSKU = { SKUID: string; Gender: string; Cat: number };

type State = { apiData: MappedSKU[] };
type Action = { type: 'SET_API_DATA'; payload: MappedSKU[] };

const initialState: State = { apiData: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_API_DATA':
      return { ...state, apiData: action.payload };
    default:
      return state;
  }
}

export const AppContext = createContext<{state: State; dispatch: React.Dispatch<Action>}>({
  state: initialState, dispatch: () => {},
});

export const AppProvider = ({children}:{children:ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{state, dispatch}}>{children}</AppContext.Provider>;
};
