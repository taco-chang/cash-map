import * as Firebase from 'firebase';
import Moment from 'moment';
import uuidv4 from 'uuid/v4';

import { Cycle, ISummary, IRecordData, IResponse, ISummaryParams } from './type';


// TODO: Basic
const STORAGE_KEY = 'CASH_MAP_KEY';

const RecordRef = Firebase.initializeApp({
  apiKey      : 'AIzaSyC8rTJofdQg0Y1k2-Zjav-ASVbSg0fziOg',
  authDomain  : 'cashmap-cdce1.firebaseapp.com',
  databaseURL : 'https://cashmap-cdce1.firebaseio.com/'
}).database().ref((() => {
  if (!localStorage.getItem(STORAGE_KEY))
    localStorage.setItem(STORAGE_KEY, uuidv4());

  return localStorage.getItem(STORAGE_KEY) || '';
})());

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

const getSum = ({ cycle, ignore = false, list = []}: ISummaryParams) =>
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


// TODO: Firebase Listeners
// const RECORD_LIST: IRecordData[] = [];

// RecordRef.on('child_added', snapshot => RECORD_LIST.push({ ...snapshot.val(), uid: snapshot.key || '' }));

// RecordRef.on('child_changed', snapshot => RECORD_LIST.splice(
//   RECORD_LIST.findIndex(({ uid }) => uid === snapshot.val().uid),
//   1,
//   snapshot.val()
// ));

// RecordRef.on('child_removed', snapshot => RECORD_LIST.splice(
//   RECORD_LIST.findIndex(({ uid }) => uid === snapshot.val().uid),
//   1
// ));


// TODO: Export Methods
const findByUID = (uid: string): Promise<IResponse<IRecordData>> => new Promise((resolve, reject) =>
  RecordRef.child(uid).on('value', snapshot => snapshot.val() === null ? reject(
    'DATA_NOT_FOUND'
  ) : resolve({
    status  : 200,
    content : snapshot.val() === null ? null : { ...snapshot.val(), uid }
  })));

const getList = (params: any = {}): Promise<IResponse<IRecordData[]>> => new Promise((resolve, reject) => 
  RecordRef.on('value', snapshot => snapshot.val() === null ? reject(
    'DATA_NOT_FOUND'
  ) : resolve({
    status  : 200,
    content : Object.keys(snapshot.val()).map(uid => ({ ...snapshot.val()[uid], uid })).filter(record =>
      Object.keys(params).length === Object.keys(params).filter(param =>
        !params[param] || record[param] === params[param]  
      ).length
    )
  }))
);

const getGroups = (): Promise<IResponse<string[]>> => new Promise((resolve, reject) =>
  RecordRef.on('value', snapshot => snapshot.val() === null ? reject(
    'DATA_NOT_FOUND'
  ) : resolve({
    status  : 200,
    content : Object.keys(snapshot.val())
      .map(uid => snapshot.val()[uid])
      .filter(({ group }) => !!group)
      .map(({ group }) => group)
  }))
);

const getSummary = ({ cycle, ignore, list }: ISummaryParams): Promise<IResponse<ISummary>> | ISummary =>
  list ? getSum({ cycle, ignore, list }) : new Promise((resolve, reject) =>
    RecordRef.on('value', snapshot => snapshot.val() === null ? reject(
      'DATA_NOT_FOUND'
    ) : resolve({
      status  : 200,
      content : getSum({
        cycle,
        ignore,
        list: Object.keys(snapshot.val()).map(uid => snapshot.val()[uid])
      })
    }))
  );

const doAdd = (record: IRecordData): Promise<IResponse<boolean>> => {
  delete record.uid;

  return RecordRef.push(record).then(() => ({
    status  : 200,
    content : true
  }));
};

const doUpdate = (record: IRecordData): Promise<IResponse<boolean>> => {
  const uid = record.uid || '';

  delete record.uid;

  return RecordRef.child(uid).update(record).then(() => ({
    status  : 200,
    content : true
  }));
};

const doRemove = (record: IRecordData): Promise<IResponse<boolean>> =>
  RecordRef.child(record.uid || '').remove().then(() => ({
    status  : 200,
    content : true
  }));

const doClear = (): Promise<IResponse<boolean>> =>
  RecordRef.remove().then(() => ({
    status  : 200,
    content : true
  }));

const doDuplicate = (records: IRecordData[]) => new Promise<IResponse<boolean>>(resolve => {
  let count = 0;

  records.forEach(record => {
    delete record.uid;

    RecordRef.push(record).then(() => {
      count++;

      if (count === records.length) resolve({
        status  : 200,
        content : true
      });
    });
  });
});

export default {
  findByUID,
  getList,
  getGroups,
  getSummary,

  doAdd,
  doUpdate,
  doRemove,
  doClear,
  doDuplicate
};
