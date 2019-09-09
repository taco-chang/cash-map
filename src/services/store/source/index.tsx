import React, { ReactNode, FC, createContext, useState, useReducer, useContext, useEffect } from 'react';

import { getKey, get } from './storage';
import { SourceReducer } from './reducer';
import { IAction, ISource, ISourceContext } from './type';


export const useSource = () => useContext(SourceContext);
export type IAction = IAction;
export type ISource = ISource;

const SourceContext = createContext<ISourceContext>({
  sourceKey : getKey(),
  sources   : [],
  dispatch  : () => {}
});

const SourceStore: FC<{ children: ReactNode; }> = ({ children }) => {
  const [ sourceKey, setSourceKey ] = useState(getKey());
  const [{ current, list }, dispatch ] = useReducer(SourceReducer, { current: getKey(), list: get()});

  useEffect(() => {
    if (sourceKey !== current)
      setSourceKey(current);
  }, [ sourceKey, current, setSourceKey ]);

  return sourceKey !== current ? null : (
    <SourceContext.Provider value={{ sourceKey: current, sources: list, dispatch }}>
      { children }
    </SourceContext.Provider>
  );
};

export default SourceStore;
