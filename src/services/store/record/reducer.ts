import { Reducer } from 'react';
import FirebaseRecord from './firebase';

import {
  ISummary,
  IStoreState,
  IStoreAction,
  IDispatchState,
  IDispatchAction,
  IRecordData,
  IResponse,
  Cycle
} from './type';


// TODO: Functions
const emptyFn = () => {};

const toList = (list: {[ groupName: string ]: IRecordData[]; }): IRecordData[] =>
  Object.keys(list).reduce(($list: IRecordData[], groupName: string) => [
    ...$list,
    ...list[ groupName ]
  ], []);

const toGroup = (list: IRecordData[]): {[ groupName: string ]: IRecordData[]; } =>
  list.sort(({ group: g1 = '' }, { group: g2 = '' }) =>
    !g1 ? 1 : !g2 ? -1 : g1 > g2 ? 1 : g1 < g2 ? -1 : 0
  ).reduce((map: {[ groupName: string ]: IRecordData[]; }, record) => ({
    ...map,
    [ record.group || 'UNGROUP' ]: [ ...map[ record.group || 'UNGROUP' ] || [], record ]
  }), {});

const doReload = (
  sourceKey: string,
  params: IRecordData,
  { status, content }: IResponse<boolean>
) => new Promise<IResponse<IRecordData[]>>((resolve, reject) => {
  if (status !== 200 || !content) reject(
    'Error Request.'
  );

  FirebaseRecord.getList(sourceKey, params).then(res => resolve(res));
});


// TODO: Reducers
export const StateStore: Reducer<IStoreState, IStoreAction> = (state, {
  data,
  group   = state.group,
  summary = state.summary,
  list    = toList(state.list)
}) => ({
  group,
  summary,
  data : data === true ? state.data : data,
  list : toGroup(list)
});

export const DispatchStore: Reducer<IDispatchState, IDispatchAction> = (state, {
  action,
  params  : $params = {},
  success = emptyFn,
  fail    = emptyFn
}) => {
  const { dispatch, sourceKey, params, cycle } = state;

  switch (action) {
    case 'SUMMARY':
      (FirebaseRecord.getSummary(sourceKey, { cycle: ($params.cycle || cycle) as Cycle }) as Promise<IResponse<ISummary>>)
        .then(({ content }) => dispatch({ summary: content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      return { dispatch, sourceKey, params, cycle: ($params.cycle || cycle) as Cycle };

    case 'LIST':
      FirebaseRecord.getList(sourceKey, $params)
        .then(({ content }) => dispatch({ list: content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      return { dispatch, sourceKey, cycle, params: $params };

    case 'FIND':
      FirebaseRecord.findByUID(sourceKey, $params.uid || '')
        .then(({ content }) => dispatch({ data: !content ? true : content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      break;

    case 'GROUP':
      FirebaseRecord.getGroups(sourceKey)
        .then(({ content }) => dispatch({ group: content, data: true }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      break;

    case 'CREATE':
      FirebaseRecord.doAdd(sourceKey, $params)
        .then(res => doReload(sourceKey, params, res)
          .then(({ content }) => dispatch({ list: content }))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

      break;

    case 'UPDATE':
      FirebaseRecord.doUpdate(sourceKey, $params)
        .then(res => doReload(sourceKey, params, res)
          .then(({ content }) => dispatch({ list: content }))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

    break;

    case 'REMOVE':
      FirebaseRecord.doRemove(sourceKey, $params)
        .then(res => doReload(sourceKey, params, res)
          .then(({ content }) => dispatch({ list: content }))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

      break;

    case 'CLEAR':
      FirebaseRecord.doClear(sourceKey)
        .then(() => dispatch({
          list    : [],
          group   : [],
          summary : { cycle, income: 0, expenses: 0, deposit: 0, applicable: 0 }
        }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      break;
  }
  return state;
};
