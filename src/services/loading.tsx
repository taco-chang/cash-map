import React, {
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';


// TODO: Types
interface IState { show: boolean; callbackFn?: () => void; }
interface IContext { isLoading: boolean; setLoading: Dispatch<SetStateAction<IState>> }

// TODO: Variables
const useLoading = () => useContext(Context);

// TODO: Components
const Context = createContext<IContext>({ isLoading: false, setLoading: () => {} });

const LoadingMask: FC<{ children?: ReactNode }> = ({ children }) => {
  const [{ show: isLoading, callbackFn }, setLoading ] = useState<IState>({ show: false });

  useEffect(() => {
    if (callbackFn instanceof Function)
      callbackFn();
  }, [ callbackFn ]);

  return (
    <Context.Provider value={{ isLoading, setLoading }}>
      { !isLoading ? null : (
        <div className="loading-mask" />
      ) }
      { children }
    </Context.Provider>
  );
}

export default LoadingMask;
export { useLoading };
