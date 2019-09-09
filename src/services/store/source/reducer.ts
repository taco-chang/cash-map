import { Reducer } from 'react';
import { get, create, update, remove, setKey } from './storage';

import { IState, IAction } from './type';

export const SourceReducer: Reducer<IState, IAction> = (state, { action, source, switchTo }) => {
  const { current, list } = state;

  switch (action) {
    case 'LIST'   : return { current, list: get()};
    case 'SWITCH' :
      if (!switchTo) throw new Error(
        'If you wanna switch the data source, please input the key at "switchTo".'
      );
      return { current: setKey(switchTo || '') || '', list };

    default:
      if (!source) throw new Error(
        'If you wanna override data, the source can\'t be empty.'
      );
      
      switch (action) {
        case 'CREATE' : return { list: create(source), current: setKey(source.uid) };
        case 'UPDATE' : return { current, list: update(source) };
        case 'REMOVE' : return {
          list    : remove(source),
          current : source.uid !== current ? current : list.reduce(($uid: string, { uid, desc }) =>
            'MY_RECORD' === desc ? uid : $uid, ''
          )
        };
      }
  }
  return state;
}