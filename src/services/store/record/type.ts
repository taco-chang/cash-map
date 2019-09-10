import { Dispatch, SetStateAction, useState } from 'react';

import Moment from 'moment';
import uuidv4 from 'uuid/v4';


const DATE_FROMAT: string = 'YYYY/MM';

// TODO: Basic Types
export type Cycle = 'day' | 'month' | 'year';

export type FbEventAction = 'CREATE' | 'UPDATE' | 'REMOVE';

export interface ISummary { cycle: Cycle; income: number; expenses: number; deposit: number; applicable: number; }

export interface IRecordData {
  uid    ?: string;    desc    ?: string;
  type   ?: string;    status  ?: string;
  cycle  ?: string;    validFm ?: string;
  amount ?: number;    validTo ?: string;
  group  ?: string;
}

export interface IResponse<T> { status: number; content: T; message?: string; }

export interface ISummaryParams { cycle: Cycle; ignore?: boolean; list?: IRecordData[]; }

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


// TODO: Reducer Types
export interface IDispatchState {
  params    : IRecordData;
  sourceKey : string;
  cycle     : 'day' | 'month' | 'year';
  dispatch  : Dispatch<IStoreAction>;
}

export interface IDispatchAction {
  action   : 'SWITCH' | 'LIST' | 'FIND' | 'GROUP' | 'CREATE' | 'UPDATE' | 'REMOVE' | 'CLEAR' | 'SUMMARY';
  params  ?: IRecordData;
  success ?: (params: IRecordData) => void;
  fail    ?: (e: Error, params?: IRecordData) => void;
}

export interface IStoreAction {
  data    ?: IRecordData | true;
  summary ?: ISummary;
  group   ?: string[];
  list    ?: IRecordData[];
}

export interface IStoreState {
  data    ?: IRecordData;
  summary  : ISummary;
  group    : string[];
  list     : {[ groupName: string ]: IRecordData[]; };
}
