import * as Firebase from 'firebase';
import { useSource } from '../source';

import { StateStore, DispatchStore } from './reducer';
import FirebaseRecord from './firebase';

import React, {
  FC,
  ReactNode,
  Dispatch,
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback
} from 'react';

import {
  Cycle,
  FbEventAction,
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

interface IEventInput {
  sourceKey: string;
  cycle: Cycle;
  params: IRecordData;
  $dispatch: Dispatch<IStoreAction>;
}


// TODO: Context Components
export const isKeyValid = FirebaseRecord.isValid;
export const doSummary  = FirebaseRecord.doSummary;
export const useRecord  = () => useContext(RecordContext);


// TODO: Events
const useEvents = ({ sourceKey, cycle, params, $dispatch }: IEventInput) => {
  const firebaseHandler = useCallback((
    action: FbEventAction,
    snapshot: Firebase.database.DataSnapshot,
    all: IRecordData[]
  ) => {
    const triggerUID = snapshot.key;

    switch (action) {
      case 'CREATE':
        all.push({ ...snapshot.val(), uid: triggerUID });
        break;
      case 'UPDATE':
        all.splice(all.findIndex(({ uid }) => uid === triggerUID), 1, { ...snapshot.val(), uid: triggerUID });
        break;
      case 'REMOVE':
        all.splice(all.findIndex(({ uid }) => uid === triggerUID), 1);
        break;
    }

    $dispatch({
      summary : FirebaseRecord.doSummary({ cycle, list: all }),
      list    : FirebaseRecord.doFilter(params, all),
      group   : all.reduce((res: string[], { group }) =>
        !group || res.indexOf(group) >= 0 ? res : [ ...res, group ], []
      )
    });
  }, [ cycle, params, $dispatch ]);

  useEffect(() => {
    FirebaseRecord.on(sourceKey, true, firebaseHandler);

    return () => FirebaseRecord.on(sourceKey, false);
  });
};


// TODO: Components
const RecordContext = createContext<IRecordContext>({
  ...DEFAULT_STATE,
  dispatch: () => {},
  [ STORE_DISPATCH ]: () => {}
});

const RecordStore: FC<{ children: ReactNode; }> = ({ children }) => {
  const { sourceKey } = useSource();
  const [ store, $dispatch ] = useReducer(StateStore, DEFAULT_STATE);

  const [{ cycle, params }, dispatch ] = useReducer(DispatchStore, {
    sourceKey,
    params   : {},
    cycle    : 'month',
    dispatch : $dispatch
  });

  useEvents({ sourceKey, cycle, params, $dispatch });

  return (
    <RecordContext.Provider value={{ ...store, dispatch, [ STORE_DISPATCH ]: $dispatch }}>
      { children }
    </RecordContext.Provider>
  );
};

export default RecordStore;
