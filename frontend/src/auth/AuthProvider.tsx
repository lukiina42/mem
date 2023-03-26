import { User } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface ContextInterface {
  token: string | null;
  user: User | null;
  setState?: () => void;
  signin: (params: StoredAuth) => void;
  signout: () => void;
}

const LOCAL_STORAGE_AUTH_KEY = "rettiwt-auth";

interface DefaultAuthState {
  token: string | null;
  user: User | null;
}

export interface StoredAuth {
  token: string;
  user: User;
}

const initialState = {
  token: null,
  user: null,
};

const AuthContext = createContext(
  createContextValue({
    token: initialState.token,
    user: initialState.user,
    setState: () =>
      console.error("You are using AuthContext without AuthProvider!"),
  })
);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = usePersistedAuth(initialState);

  const contextValue = useMemo(() => {
    const { token, user } = state as DefaultAuthState;
    return createContextValue({ token, user, setState });
  }, [state, setState]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

function createContextValue({
  token,
  user,
  setState,
}: {
  token: string | null;
  user: User | null;
  //TODO not any
  setState: any;
}): ContextInterface {
  return {
    token,
    user,
    signin: ({ token, user }) => setState({ token, user }),
    signout: () => setState({ token: null, user: null }),
  };
}

function usePersistedAuth(defaultState: DefaultAuthState) {
  const [state, setStateRaw] = useState(() => getStorageState(defaultState));

  const setState = useCallback((newState: DefaultAuthState) => {
    setStateRaw(newState);
    setStorageState(newState);
  }, []);

  return [state, setState as Dispatch<SetStateAction<DefaultAuthState>>];
}

function getStorageState(defaultState: DefaultAuthState) {
  if (!window.localStorage) {
    return defaultState;
  }

  const rawData = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  if (!rawData) {
    return defaultState;
  }

  try {
    const { user, token } = JSON.parse(rawData);

    if (token && user && user.firstName && user.lastName && user.id) {
      return { token, user };
    }
  } catch {}

  return defaultState;
}

function setStorageState(newState: DefaultAuthState): void {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newState));
}
