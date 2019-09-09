import * as Firebase from 'firebase';
import Moment from 'moment';

import { Cycle, ISummary, IRecordData, IResponse, ISummaryParams } from './type';
import { FIREBASE_OPTIONS } from '../../../assets/config/api-key.json';

// TODO: Basic
const Database = Firebase.initializeApp(FIREBASE_OPTIONS).database();

const getRef = (key: string) => Database.ref(key);

const getAvgAmount = (sumcycle: Cycle, { cycle = 'month', amount = 0 }: IRecordData): number => {
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

const getSpecificSum = ({ cycle, ignore = false, list = []}: ISummaryParams) =>
  list.filter(record => ignore || 'actual' === record.status).reduce((summary: ISummary, record) => {
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
  }, { cycle, income: 0, expenses: 0, deposit: 0, applicable: 0 });


// TODO: Export Methods
const isValid = (key: string): Promise<IResponse<boolean>> => new Promise(resolve =>
  getRef(key).on('value', snapshot => resolve({
    status  : 200,
    content : snapshot.exists()
  }))
);

const findByUID = (key: string, uid: string): Promise<IResponse<IRecordData>> => new Promise((resolve, reject) =>
  getRef(key).child(uid).on('value', snapshot => snapshot.val() === null ? reject(
    'DATA_NOT_FOUND'
  ) : resolve({
    status  : 200,
    content : { ...snapshot.val(), uid }
  })));

const getList = (key: string, params: any = {}): Promise<IResponse<IRecordData[]>> => new Promise(resolve => 
  getRef(key).on('value', snapshot => resolve({
    status  : 200,
    content : Object.keys(snapshot.val() || {}).map(uid => ({ ...snapshot.val()[uid], uid })).filter(record =>
      Object.keys(params).length === Object.keys(params).filter(param =>
        !params[param] || record[param] === params[param]  
      ).length
    )
  }))
);

const getGroups = (key: string): Promise<IResponse<string[]>> => new Promise(resolve =>
  getRef(key).on('value', snapshot => resolve({
    status  : 200,
    content : Object.keys(snapshot.val() || {})
      .map(uid => snapshot.val()[uid].group)
      .reduce((res: string[], group) => !group || res.indexOf(group) >= 0 ? res : [ ...res, group ], [])
  }))
);

const getSummary = (key: string, { cycle, ignore }: ISummaryParams): Promise<IResponse<ISummary>> => new Promise(resolve =>
  getRef(key).on('value', snapshot => resolve({
    status  : 200,
    content : getSpecificSum({
      cycle,
      ignore,
      list: Object.keys(snapshot.val() || {}).map(uid => snapshot.val()[uid])
    })
  }))
);

const doAdd = (key: string, record: IRecordData): Promise<IResponse<boolean>> => {
  delete record.uid;

  return getRef(key).push(record).then(() => ({
    status  : 200,
    content : true
  }));
};

const doUpdate = (key: string, record: IRecordData): Promise<IResponse<boolean>> => {
  const uid = record.uid || '';

  delete record.uid;

  return getRef(key).child(uid).update(record).then(() => ({
    status  : 200,
    content : true
  }));
};

const doRemove = (key: string, record: IRecordData): Promise<IResponse<boolean>> =>
  getRef(key).child(record.uid || '').remove().then(() => ({
    status  : 200,
    content : true
  }));

const doClear = (key: string): Promise<IResponse<boolean>> =>
  getRef(key).remove().then(() => ({
    status  : 200,
    content : true
  }));

export default {
  getSpecificSum,

  isValid,
  findByUID,
  getList,
  getGroups,
  getSummary,

  doAdd,
  doUpdate,
  doRemove,
  doClear
};
