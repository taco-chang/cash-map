import React, { FC, ReactNode, Dispatch, createContext, useReducer, useContext } from 'react';

import { StateStore, DispatchStore } from './reducer';
import FirebaseRecord from './firebase';

import {
  Cycle,
  ISummary,
  IDispatchAction,
  IStoreState,
  IStoreAction,
  IRecordData,
  RecordModel
} from './type';


// TODO: Variables
const STORE_DISPATCH = Symbol('STORE_DISPATCH');
const DEFAULT_STATE: IStoreState = {
  list    : {},
  group   : [],
  summary : {
    cycle      : 'month',
    income     : 0,
    expenses   : 0,
    deposit    : 0,
    applicable : 0
  }
};

// TODO: Export Basic
export type Cycle = Cycle;
export type ISummary = ISummary;
export type IRecordData = IRecordData;
export { RecordModel };

interface IRecordContext extends IStoreState {
  dispatch           : Dispatch<IDispatchAction>;
  [ STORE_DISPATCH ] : Dispatch<IStoreAction>;
}


// TODO: Context Components
export const getSummary = FirebaseRecord.getSummary;
export const useRecord = () => useContext(RecordContext);

const RecordContext = createContext<IRecordContext>({
  ...DEFAULT_STATE,
  dispatch: () => {},
  [ STORE_DISPATCH ]: () => {}
});

const RecordStore: FC<{ children: ReactNode; }> = ({ children }) => {
  const [ store, $dispatch ] = useReducer(StateStore, DEFAULT_STATE);
  const dispatch = useReducer(DispatchStore, { params: {}, cycle: 'month', dispatch: $dispatch });

  return (
    <RecordContext.Provider value={{ ...store, dispatch: dispatch[1], [ STORE_DISPATCH ]: $dispatch }}>
      { children }
    </RecordContext.Provider>
  );
};

export default RecordStore;
