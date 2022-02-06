import { createContext, ReactNode, useContext, useReducer } from "react";

interface AppContext {
  store: AppState;
  dispatch: React.Dispatch<any>;
}

interface AppState {
  navTitle: string;
}

type AppAction = { type: "SET_NAV_TITLE"; title: string };

const AppContext = createContext<AppContext>(null!);

const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "SET_NAV_TITLE":
      return {
        ...state,
        navTitle: action.title,
      };
    default:
      return state;
  }
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [store, dispatch] = useReducer(reducer, {
    navTitle: "Colorado Legislators",
  });

  return (
    <AppContext.Provider value={{ store, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContext => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error(
      "useAppContext must be called within an <AppContextProvider> tag"
    );
  }

  return appContext;
};
