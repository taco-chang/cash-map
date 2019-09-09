import uuidv4 from 'uuid/v4';
import { ISource } from './type';


const STORAGE_KEY = 'CASH_MAP_KEY';

const setSources = (list: ISource[]) => {
  localStorage.setItem('FIREBASE_KEY', JSON.stringify(list));

  return get();
};

// TODO: Export Functions
export const get = (): ISource[] => {
  if (!localStorage.getItem('FIREBASE_KEY')) setSources([{
    uid  : getKey(),
    desc : 'MY_RECORD'
  }]);

  return JSON.parse(localStorage.getItem('FIREBASE_KEY') || '[]');
};

export const create = (source: ISource) => setSources([ ...get(), source ]);

export const update = (source: ISource) => setSources(get().map(data => data.uid === source.uid ? source : data));

export const remove = (source: ISource) => setSources(get().filter(data => data.uid !== source.uid));

export const setKey = (key: string) => {
  localStorage.setItem(STORAGE_KEY, key);

  return key;
};

export const getKey = () => {
  if (!localStorage.getItem(STORAGE_KEY))
    localStorage.setItem(STORAGE_KEY, uuidv4());

  return localStorage.getItem(STORAGE_KEY) || '';
};
