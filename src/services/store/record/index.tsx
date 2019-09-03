import React, { FC, Reducer, Dispatch, SetStateAction, ReactNode, createContext, useState, useContext, useReducer } from 'react';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';

import { findByID, getList, getGroups, createRecord, updateRecord, removeRecord, clearRecord } from './request';


// TODO: Types
const DATE_FROMAT: string = 'YYYY/MM';
const REFRESH_DISPATCH = Symbol('DISPATCH');

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

interface IStoreState { data?: IRecordData; summary: ISummary; group: string[]; list: {[ groupName: string ]: IRecordData[]; }; }
interface IStoreAction { data?: IRecordData | true; summary?: ISummary; group?: string[]; list?: IRecordData[]; }

interface IRequestState {
  searchParams: IRecordData;
  summaryCycle: 'day' | 'month' | 'year';
  storeDispatch: Dispatch<IStoreAction>;
}

export interface IRequestAction {
  action   : 'LIST' | 'FIND' | 'GROUP' | 'CREATE' | 'UPDATE' | 'REMOVE' | 'CLEAR' | 'SUMMARY';
  params  ?: IRecordData;
  success ?: (params: IRecordData) => void;
  fail    ?: (e: Error, params?: IRecordData) => void;
}

export interface ISummary {
  cycle: 'day' | 'month' | 'year';
  income: number;
  expenses: number; 
  deposit: number;
  applicable: number;
}

export interface IRecordData {
  uid     ?: string;     desc    ?: string;
  type    ?: string;     status  ?: string;
  cycle   ?: string;     validFm ?: string;
  validTo ?: string;     amount  ?: number;
  group   ?: string;
}

export class RecordModel {
  private $uid     !: string;
  private $desc    !: [ string, Dispatch<SetStateAction<string>> ];
  private $type    !: [ string, Dispatch<SetStateAction<string>> ];
  private $status  !: [ string, Dispatch<SetStateAction<string>> ];
  private $cycle   !: [ string, Dispatch<SetStateAction<string>> ];
  private $group   !: [ string, Dispatch<SetStateAction<string>> ];
  private $validFm !: [ string, Dispatch<SetStateAction<string>> ];
  private $validTo !: [ string, Dispatch<SetStateAction<string>> ];
  private $amount  !: [ number, Dispatch<SetStateAction<number>> ];

  constructor({
    uid     = uuidv4() , desc    = '' , 
    type    = 'income' , status  = 'expected',
    cycle   = 'month'  , validFm = Moment(new Date()).format(DATE_FROMAT),
    validTo = ''       , group   = '',
    amount  = 0
  }: IRecordData = {}) {
    this.$uid     = uid;                  this.$desc    = useState(desc);
    this.$type    = useState(type);       this.$status  = useState(status);
    this.$cycle   = useState(cycle);      this.$validFm = useState(validFm);
    this.$validTo = useState(validTo);    this.$amount  = useState(amount);
    this.$group   = useState(group);
  }

  get uid(): string { return this.$uid; }
  
  get desc(): string { return this.$desc[0]; }
  set desc(value: string) { this.$desc[1](value); }

  get type(): string { return this.$type[0]; }               get status(): string { return this.$status[0]; }
  set type(value: string) { this.$type[1](value); }          set status(value: string) { this.$status[1](value); }

  get cycle(): string { return this.$cycle[0]; }             get validFm(): string { return this.$validFm[0]; }
  set cycle(value: string) { this.$cycle[1](value); }        set validFm(value: string) { this.$validFm[1](value); }

  get validTo(): string { return this.$validTo[0]; }         get amount(): number { return this.$amount[0]; }
  set validTo(value: string) { this.$validTo[1](value); }    set amount(value: number) { this.$amount[1](value); }

  get group(): string { return this.$group[0]; }
  set group(value: string) { this.$group[1](value); }

  get vdateFm(): Date | null { return this.validFm ? Moment(this.validFm + '/01', 'YYYY/MM/DD').toDate() : null; }
  set vdateFm(value: Date | null) { this.validFm = !value ? '' : Moment(value).format(DATE_FROMAT); }

  get vdateTo(): Date | null { return this.validTo ? Moment(this.validTo + '/01', 'YYYY/MM/DD').toDate() : null; }
  set vdateTo(value: Date | null) { this.validTo = !value ? '' : Moment(value).format(DATE_FROMAT); }

  get amountStr(): string { return this.amount ? this.amount.toString() : ''; }
  set amountStr(value: string) {
    const amt = parseFloat(value);

    this.amount = !isNaN(amt) ? amt : 0;
  }

  getJSON(showID: boolean = true): IRecordData {
    return {
      desc   : this.desc   , status  : this.status  ,
      type   : this.type   , validFm : this.validFm ,
      cycle  : this.cycle  , validTo : this.validTo ,
      group  : this.group  ,
      amount : this.amount , ...( showID ? { uid: this.uid } : {})
    };
  }

  reset(): void {
    this.$uid   = uuidv4();    this.desc    = '';
    this.type   = 'income';    this.status  = 'actual';
    this.cycle  = 'month';     this.validFm = Moment(new Date()).format(DATE_FROMAT);
    this.amount = 0;           this.validTo = '';
    this.group  = '';
  }
}

// TODO: Hooks & Functions
const useRecord = () => useContext(Context);

const getAvgAmount = (sumcycle: 'day' | 'month' | 'year', { cycle = 'month', amount = 0 }: IRecordData): number => {
  const daysInMonth = Moment(new Date()).daysInMonth();
  const daysInYear  = Moment(`${ new Date().getFullYear() }/12/31`, 'YYYY/MM/DD').dayOfYear();

  switch (sumcycle) {
    case 'day': switch (cycle) {
      case 'month' : return Math.floor(amount / daysInMonth);
      case 'year'  : return Math.floor(amount / daysInYear);
    }
    break;
    case 'month': switch (cycle) {
      case 'day'  : return amount * daysInMonth;
      case 'year' : return Math.floor(amount / 12);
    }
    break;
    case 'year': switch (cycle) {
      case 'day'   : return amount * daysInYear;
      case 'month' : return amount * 12;
    }
    break;
  }
  return amount;
};

export const getSummary = (
  cycle: 'day' | 'month' | 'year',
  list: IRecordData[],
  ignore: boolean = false
): ISummary => list.filter(record => ignore || 'actual' === record.status).reduce((summary: ISummary, record) => {
  const amount = getAvgAmount(summary.cycle, record);

  if ('once' === record.cycle)
    summary.deposit += amount * ('expenses' === record.type ? -1 : 1);
  else switch (record.type) {
    case 'income'   : summary.income   += amount; break;
    case 'expenses' : summary.expenses += amount; break;
    case 'deposit'  :
      summary.deposit += amount;
      summary.income  -= amount;
      break;
  }
  return { ...summary, applicable: summary.income - summary.expenses };
}, {
  cycle,
  income  : 0, expenses   : 0,
  deposit : 0, applicable : 0
});

// TODO: Reducers
const recordStore: Reducer<IStoreState, IStoreAction> = (state = DEFAULT_STATE, {
  data,
  group   = state.group,
  summary = state.summary,
  list    = Object.keys(state.list).reduce(
    ($list: IRecordData[], groupName: string) => [ ...$list, ...state.list[ groupName ]],
    []
  )
}) => ({
  group, summary,
  data: data === true ? state.data : data,
  list: list.sort(({ group: g1 = '' }, { group: g2 = '' }) =>
    !g1 ? 1 : !g2 ? -1 : g1 > g2 ? 1 : g1 < g2 ? -1 : 0
  ).reduce((map: {[ groupName: string ]: IRecordData[]; }, record) => ({
    ...map,
    [ record.group || 'UNGROUP' ]: [ ...map[ record.group || 'UNGROUP' ] || [], record ]
  }), {})
});

const doReducer: Reducer<IRequestState, IRequestAction> = (state, {
  action,
  params = {},
  success = () => {},
  fail = () => {}
}) => {
  const { searchParams, summaryCycle, storeDispatch } = state;

  const doReload = () => getList<IRecordData>(searchParams).then(({ content: list }) =>
    getList<IRecordData>().then(({ content: all }) => 
      getGroups<IRecordData>().then(({ content: group }) =>
        storeDispatch({ list, group, summary: getSummary(summaryCycle, all) })
      )
    )
  );

  switch (action) {
    case 'SUMMARY':
      if (!params.cycle || ['day', 'month', 'year'].indexOf(params.cycle) < 0) throw new Error(
        'If wanna re-calculate the summary, must specify cycle.'
      );

      getList<IRecordData>().then(({ content }) => storeDispatch({
        summary: getSummary(params.cycle as 'day' | 'month' | 'year', content)
      }))
      .then(() => success(params))
      .catch(e => fail(e, params));

      return { searchParams, storeDispatch, summaryCycle: params.cycle as 'day' | 'month' | 'year' };

    case 'LIST': getList<IRecordData>(params)
      .then(({ content }) => storeDispatch({ list: content }))
      .then(() => success(params))
      .catch(e => fail(e));

      return { searchParams: params, storeDispatch, summaryCycle };

    case 'FIND': findByID<IRecordData>(params.uid)
      .then(({ content }) => storeDispatch({ data: content }))
      .then(() => success(params))
      .catch(e => fail(e));

    break;
    case 'GROUP': getGroups<IRecordData>()
      .then(({ content }) => storeDispatch({ data: true, group: content }))
      .then(() => success(params))
      .catch(e => fail(e));

    break;
    case 'CREATE' : createRecord<IRecordData>(params)
      .then(doReload)
      .then(() => success(params))
      .catch(e => fail(e, params));

    break;
    case 'UPDATE' : updateRecord<IRecordData>(params, params.uid)
      .then(doReload)
      .then(() => success(params))
      .catch(e => fail(e, params));

    break;
    case 'REMOVE' : removeRecord<IRecordData>(params.uid)
      .then(doReload)
      .then(() => success(params))
      .catch(e => fail(e, params));

    break;
    case 'CLEAR'  : clearRecord<IRecordData>()
      .then(() => getList<IRecordData>()
        .then(() => storeDispatch({
          list: [],
          summary: { cycle: summaryCycle, income: 0, expenses: 0, deposit: 0, applicable: 0 }
        }))
        .then(() => success(params))
        .catch(e => fail(e))
      )
      .catch(e => fail(e));

    break;
  }
  return state;
}

// TODO: Components
const Context = createContext<{
  store: IStoreState;
  dispatch: Dispatch<IRequestAction>;
  [ REFRESH_DISPATCH ]: Dispatch<IStoreAction>;
}>({
  store: DEFAULT_STATE,
  dispatch: () => {},
  [ REFRESH_DISPATCH ]: () => {}
});

const RecordStore: FC<{ children: ReactNode }> = ({ children }) => {
  const [ store, storeDispatch ] = useReducer(recordStore, DEFAULT_STATE);

  const $do = useReducer(doReducer, {
    searchParams: {},
    summaryCycle: 'month',
    storeDispatch
  });

  return (
    <Context.Provider value={{ store, dispatch: $do[1], [ REFRESH_DISPATCH ]: storeDispatch }}>
      { children }
    </Context.Provider>
  );
};

// TODO: Export
export default RecordStore;
export { useRecord };
