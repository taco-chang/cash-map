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

const doReload = (cycle: Cycle, params: IRecordData, { status, content }: IResponse<boolean>) => new Promise<{
  list    : IRecordData[];
  group   : string[];
  summary : ISummary;
}>((resolve, reject) => {
  if (status !== 200 || !content) reject(
    'Error Request.'
  );

  FirebaseRecord.getList(params)
    .then(({ content: list }) => FirebaseRecord.getGroups()
      .then(({ content: group }) => (FirebaseRecord.getSummary({ cycle }) as Promise<IResponse<ISummary>>)
        .then(({ content: summary }) => resolve({ list, group, summary }))
      )
    );
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
  params: $params = {},
  success = emptyFn,
  fail    = emptyFn
}) => {
  const { dispatch, params, cycle } = state;

  switch (action) {
    case 'SUMMARY':
      (FirebaseRecord.getSummary({ cycle: ($params.cycle || cycle) as Cycle }) as Promise<IResponse<ISummary>>)
        .then(({ content }) => dispatch({ summary: content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      return { dispatch, params, cycle: ($params.cycle || cycle) as Cycle };

    case 'LIST':
      FirebaseRecord.getList($params)
        .then(({ content }) => dispatch({ list: content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      return { dispatch, cycle, params: $params };

    case 'FIND':
      FirebaseRecord.findByUID($params.uid || '')
        .then(({ content }) => dispatch({ data: !content ? true : content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      break;

    case 'GROUP':
      FirebaseRecord.getGroups()
        .then(({ content }) => dispatch({ group: content }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      break;

    case 'CREATE':
      FirebaseRecord.doAdd($params)
        .then(res => doReload(cycle, params, res)
          .then(({ list, group, summary }) => dispatch({ list, group, summary }))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

      break;

    case 'UPDATE':
      FirebaseRecord.doUpdate($params)
        .then(res => doReload(cycle, params, res)
          .then(({ list, group, summary }) => dispatch({ list, group, summary }))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

    break;

    case 'REMOVE':
      FirebaseRecord.doRemove($params)
        .then(res => doReload(cycle, params, res)
          .then(({ list, group, summary }) => dispatch({ list, group, summary }))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

      break;

    case 'CLEAR':
      FirebaseRecord.doClear()
        .then(() => dispatch({
          list    : [],
          group   : [],
          summary : { cycle, income: 0, expenses: 0, deposit: 0, applicable: 0 }
        }))
        .then(() => success(params))
        .catch(e => fail(e, params));

      break;

    case 'DUPLICATE':
      FirebaseRecord.doDuplicate(JSON.parse(localStorage.getItem('CM_RECORDS') || '[]'))
        .then(res => doReload(cycle, params, res)
          .then(({ list, group, summary }) => dispatch({ list, group, summary }))
          .then(() => localStorage.removeItem('CM_RECORDS'))
          .then(() => success(params))
        )
        .catch(e => fail(e, params));

      break;
  }
  return state;
};
