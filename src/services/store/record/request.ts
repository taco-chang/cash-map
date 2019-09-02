const getRecords = <T extends { uid?: string; }>(): T[] => JSON.parse(localStorage.getItem('CM_RECORDS') || '[]');
const setRecords = <T extends { uid?: string; }>(records: T[]): void => localStorage.setItem('CM_RECORDS', JSON.stringify(records));

interface IResponse<T> {
  status: number;
  content: T;
  message?: string;
}

export const findByID = <T extends { uid?: string; }>(id?: string) => new Promise<IResponse<T>>((resolve, reject) => {
  if (!id) reject(
    new Error('If wanna get the specify record, must input index.')
  );

  resolve({
    status: 200,
    content: getRecords<T>().filter(({ uid }) => uid === id)[0]
  });
});

export const getList = <T extends { uid?: string; }>({ status, type }: { status?: string; type?: string; } = {}) => new Promise<IResponse<T[]>>(resolve => resolve({
  status: 200,
  content: getRecords<T>().filter(data =>
    (!status || ((data as any).status === status)) && (!type || ((data as any).type === type))
  )
}));

export const getGroups = <T extends { uid?: string; group?: string; }>() => new Promise<IResponse<string[]>>(resolve => resolve({
  status  : 200,
  content : Object.keys(getRecords<T>().reduce(
    (groups: { [group: string]: true; }, data: T) => data.group ? { ...groups, [ data.group ]: true } : groups,
    {}
  ))
}));

export const createRecord = <T extends { uid?: string; }>(data: T) => new Promise<IResponse<boolean>>((resolve, reject) => {
  if (!data.uid) reject(
    new Error('Must have to specify a uid when create.')
  );
  const list = getRecords<T>();

  setRecords<T>([ ...list, { ...data } ]);
  resolve({ status: 200, content: true });
});

export const updateRecord = <T extends { uid?: string; }>(data: T, id?: string) => new Promise<IResponse<boolean>>((resolve, reject) => {
  if (!id) reject(
    new Error('If wanna update the specify record, must input index.')
  );  
  const list = getRecords<T>();

  list.splice(list.findIndex(({ uid }) => uid === id), 1, data);
  setRecords<T>(list);
  resolve({ status: 200, content: true });
});

export const removeRecord = <T extends { uid?: string; }>(id?: string) => new Promise<IResponse<boolean>>((resolve, reject) => {
  if (!id) reject(
    new Error('If wanna remove the specify record, must input index.')
  );  
  const list = getRecords<T>();

  list.splice(list.findIndex(({ uid }) => uid === id), 1);
  setRecords<T>(list);
  resolve({ status: 200, content: true });
});

export const clearRecord = <T extends { uid?: string; }>() => new Promise<IResponse<boolean>>(resolve => {
  setRecords<T>([]);
  resolve({ status: 200, content: true });
});
