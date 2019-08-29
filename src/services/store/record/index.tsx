import React, { FC, Reducer, Dispatch, SetStateAction, ReactNode, createContext, useState, useContext, useReducer } from 'react';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';

import { findByID, getList, createRecord, updateRecord, removeRecord, clearRecord } from './request';


// TODO: Types
const DATE_FROMAT: string = 'YYYY/MM';
const REFRESH_DISPATCH = Symbol('DISPATCH');
const REFRESH_STATE = Symbol('STATE');

export interface IRequestAction {
  action   : 'ALL' | 'LIST' | 'FIND' | 'CREATE' | 'UPDATE' | 'REMOVE' | 'CLEAR' | 'SUMMARY';
  params  ?: IRecordData;
  success ?: (params: IRecordData) => void;
  fail    ?: (e: Error, params?: IRecordData) => void;
}

interface IStoreAction {
  override?: boolean;
  [ REFRESH_STATE ]: {
    sumcycle ?: 'day' | 'month' | 'year';
    summary  ?: ISummary;
    allData  ?: { [ uid: string ]: IRecordData; };
    target   ?: { list?: IRecordData[]; data?: IRecordData; };
  };
}

const DEFAULT_STATE: IStoreState = {
  allData  : {},
  target   : { list: [] },
  sumcycle : 'month',
  summary  : {
    income     : 0,
    expenses   : 0,
    deposit    : 0,
    applicable : 0
  }
};

export interface ISummary { income: number; expenses: number; deposit: number; applicable: number; }

export interface IRecordData {
  uid     ?: string;     desc    ?: string;
  type    ?: string;     status  ?: string;
  cycle   ?: string;     validFm ?: string;
  validTo ?: string;     amount  ?: number;
  
}

interface IStoreState {
  sumcycle : 'day' | 'month' | 'year';
  summary  : ISummary;
  allData  : { [ uid: string ]: IRecordData; };
  target   : { list: IRecordData[]; data?: IRecordData; };
}

export class RecordModel {
  private $uid       !: string;
  private $desc      !: [ string, Dispatch<SetStateAction<string>> ];
  private $type      !: [ string, Dispatch<SetStateAction<string>> ];
  private $status    !: [ string, Dispatch<SetStateAction<string>> ];
  private $cycle     !: [ string, Dispatch<SetStateAction<string>> ];
  private $validFm   !: [ string, Dispatch<SetStateAction<string>> ];
  private $validTo   !: [ string, Dispatch<SetStateAction<string>> ];
  private $amount    !: [ number, Dispatch<SetStateAction<number>> ];

  constructor({
    uid       = uuidv4() , desc    = '' , 
    type      = 'income' , status  = 'expected',
    cycle     = 'month'  , validFm = Moment(new Date()).format(DATE_FROMAT),
    validTo   = ''       , amount  = 0
  }: IRecordData = {}) {
    this.$uid       = uid;                  this.$desc    = useState(desc);
    this.$type      = useState(type);       this.$status  = useState(status);
    this.$cycle     = useState(cycle);      this.$validFm = useState(validFm);
    this.$validTo   = useState(validTo);    this.$amount  = useState(amount);
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
      amount : this.amount , ...( showID ? { uid: this.uid } : {})
    };
  }

  reset(): void {
    this.$uid   = uuidv4();    this.desc    = '';
    this.type   = 'income';    this.status  = 'actual';
    this.cycle  = 'month';     this.validFm = Moment(new Date()).format(DATE_FROMAT);
    this.amount = 0;           this.validTo = '';
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
}

// TODO: Reducers
const recordStore: Reducer<IStoreState, IStoreAction> = (state = DEFAULT_STATE, {
  override = false,
  [ REFRESH_STATE ]: {
    sumcycle = state.sumcycle,
    allData  = state.allData,
    target   : { list = state.target.list, data } = state.target
  }
}) => {
  const all = !override ? allData : list.reduce((res: {[ uid: string ]: IRecordData }, record) => ({
    ...res,
    [ record.uid || '' ]: record
  }), allData);

  return {
    ...state, sumcycle,
    allData : all,
    target  : {
      data,
      list: list.filter(({ uid = '' }) => uid in all).map(
        record => all[record.uid || ''] ? all[record.uid || ''] : record
      )
    },
    summary: Object.keys(all)
      .map(uid => all[uid])
      .filter(record => 'actual' === record.status)
      .reduce((summary: ISummary, record) => {
        const amount = getAvgAmount(sumcycle, record);
  
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
      }, { income: 0, expenses: 0, deposit: 0, applicable: 0 })
  };
};

const doReducer: Reducer<Dispatch<IStoreAction>, IRequestAction> = (
  dispatch,
  { action, params = {}, success = () => {}, fail = () => {}}
) => {
  const doReload = () => getList<IRecordData>().then(({ content }) => dispatch({
    [ REFRESH_STATE ]: {
      target: { },
      allData: content.reduce((res: {[ uid: string ]: IRecordData; }, record) => ({
        ...res,
        [ record.uid || '' ]: record
      }), {})
    }
  }));

  switch (action) {
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
        .then(() => dispatch({[ REFRESH_STATE ]: { allData: {}, target: { list: []}}}))
        .then(() => success(params))
        .catch(e => fail(e))
      )
      .catch(e => fail(e));

    break;
    case 'SUMMARY':
      if (!params.cycle || ['day', 'month', 'year'].indexOf(params.cycle) < 0) throw new Error(
        'If wanna re-calculate the summary, must specify cycle.'
      );
      dispatch({[ REFRESH_STATE ]: { sumcycle: params.cycle as 'day' | 'month' | 'year' }});

      break;
    case 'FIND': findByID<IRecordData>(params.uid)
      .then(({ content }) => dispatch({[ REFRESH_STATE ]: { target  : { data: content }}}))
      .then(() => success(params))
      .catch(e => fail(e));

      break;
    case 'LIST': getList<IRecordData>({ status: params.status, type: params.type })
      .then(({ content }) => dispatch({ override: true, [ REFRESH_STATE ]: { target  : { list: content }}}))
      .then(() => success(params))
      .catch(e => fail(e));

      break;
    case 'ALL': getList<IRecordData>()
      .then(({ content }) => dispatch({
        [ REFRESH_STATE ]: {
          allData : content.reduce((res: {[ id: number ]: IRecordData; }, data) => ({
            ...res, [ data.uid || '' ]: data
          }), {})
        }
      }))
      .then(() => success(params))
      .catch(e => fail(e));

      break;
  }
  return dispatch;
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
  const $do = useReducer(doReducer, storeDispatch);

  return (
    <Context.Provider value={{ store, dispatch: $do[1], [ REFRESH_DISPATCH ]: storeDispatch }}>
      { children }
    </Context.Provider>
  );
};

// TODO: Export
export default RecordStore;
export { useRecord };
