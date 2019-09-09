import { FormattedMessage as Fmsg } from 'react-intl';

import { isKeyValid } from '../services/store/record';
import { useSource } from '../services/store/source';

import { BsContainer, BsRow, BsCol } from './bs/BsGrid';
import DataSourceDropdown from './editor/DataSource';

import React, {
  FC,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  FormEvent,
  ChangeEvent,
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react';


// TODO: Types
interface IEventInput {
  autoFocus  : boolean;
  newKey     : string;
  desc       : string;
  syncRef    : MutableRefObject<null>;
  setNewKey  : Dispatch<SetStateAction<string>>;
  setDesc    : Dispatch<SetStateAction<string>>;
  setAllowed : Dispatch<SetStateAction<boolean>>;
}

// TODO: Events
const useEvents = ({ autoFocus, syncRef, newKey, desc, setNewKey, setDesc, setAllowed }: IEventInput) => {
  const { sources, dispatch } = useSource();

  const isAppendValid = useCallback((key: string = '', desc: string = '') =>
    !!key.trim() && !!desc.trim() && ['.', '#', '$', '[', ']'].indexOf(key) < 0
      && sources.findIndex(({ uid, desc: $desc }) => key.trim() === uid.trim() || desc.trim() === $desc.trim()) < 0 ?
        isKeyValid(key).then(({ content }) => setAllowed(content)) : setAllowed(false)
  , [ sources, setAllowed ]);

  useEffect(() => {
    const { current: el } = syncRef;

    if (autoFocus && el)
      (el as any).scrollIntoView();
  });

  return {
    onNewkeyChange: useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setNewKey(e.target.value);
      isAppendValid(e.target.value, desc);
    }, [ desc, setNewKey, isAppendValid ]),

    onDescChange: useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setDesc(e.target.value);
      isAppendValid(newKey, e.target.value);
    }, [ newKey, setDesc, isAppendValid ]),

    doStopSubmit: useCallback((e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []),

    doAdd: useCallback(() => {
      dispatch({ action: 'CREATE', source: { uid: newKey, desc: desc }});
      setNewKey('');
      setDesc('');
    }, [ newKey, desc, setNewKey, setDesc, dispatch ])
  };
};

// TODO: Component
const CloudSync: FC<{ syncKey?: string; }> =({ syncKey = '' }) => {
  const syncRef = useRef(null);
  const [ newKey, setNewKey ] = useState(syncKey);
  const [ desc, setDesc ] = useState('');
  const [ allowed, setAllowed ] = useState<boolean>(false);

  const { onNewkeyChange, onDescChange, doStopSubmit, doAdd } = useEvents({
    autoFocus: !!syncKey,
    syncRef,
    newKey,
    desc,
    setNewKey,
    setDesc,
    setAllowed
  });

  return (
    <BsContainer>
      <BsRow align="center">
        <BsCol className="form-group" width={{ def: 12, sm: 8, md: 6 }} border={{ b: true }}>
          <h5 className="mb-3">
            <label>
              <i className="mr-2 fa fa-exchange" />
              <Fmsg tagName="strong" id="SWITCH_CLOUD" />
            </label>
          </h5>

          <p className="text-light font-italic font-weight-light mb-4">
            <Fmsg id="SWITCH_DESC" />
          </p>

          <div className="form-group">
            <DataSourceDropdown />
          </div>
        </BsCol>
      </BsRow>

      <BsRow align="center">
        <BsCol width={{ def: 12, sm: 8, md: 6 }}>
          <h5 ref={ syncRef } className="mb-3">
            <i className="mr-2 fa fa-plus-square" />
            <Fmsg tagName="strong" id="APPEND_SOURCE" />
          </h5>

          <p className="text-light font-italic font-weight-light mb-4">
            <Fmsg id="APPEND_DESC" />
          </p>

          <form onSubmit={ doStopSubmit }>
            <div className="form-group">
              <Fmsg tagName="label" id="SOURCE_KEY" />
              <input type="text" className="form-control" value={ newKey } onChange={ onNewkeyChange } />
            </div>

            <div className="form-group">
              <Fmsg tagName="label" id="SOURCE_DESC" />
              <input type="text" className="form-control" value={ desc } onChange={ onDescChange } />
            </div>

            <div className="form-group text-right">
              <button type="submit" className="btn btn-primary" disabled={ !newKey.trim() || !allowed } onClick={ doAdd }>
                <i className="fa fa-plus mr-2" />

                <Fmsg id="APPEND" />
              </button>
            </div>
          </form>
        </BsCol>
      </BsRow>
    </BsContainer>
  );
};

export default CloudSync;
