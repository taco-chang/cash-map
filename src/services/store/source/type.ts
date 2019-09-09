import { Dispatch } from 'react';


export interface ISource {
  uid  : string;
  desc : string;
}

export interface IState {
  current : string;
  list    : ISource[];
}

export interface IAction {
  action    : 'LIST' | 'CREATE' | 'UPDATE' | 'REMOVE' | 'SWITCH';
  switchTo ?: string;
  source   ?: ISource;
}

export interface ISourceContext {
  sourceKey : string;
  sources   : ISource[];
  dispatch  : Dispatch<IAction>;
}
