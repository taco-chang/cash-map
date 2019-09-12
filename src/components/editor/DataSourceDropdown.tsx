import React, { Dispatch, FC, useState, useCallback, SetStateAction } from 'react';
import { IAction, ISource, useSource } from '../../services/store/source';

import BsDropdown, { BsOption } from '../bs/BsDropdown';
import SourceDesc, { SourceDescToggle } from './SourceDesc';


// TODO: Types
interface IEventInput {
  edit: ISource;
  setEdit: Dispatch<SetStateAction<ISource>>;
  dispatch: Dispatch<IAction>;
}

// TODO: Events
const useEvents = ({ edit, setEdit, dispatch }: IEventInput) => {
  return {
    onSwitch: useCallback((switchTo: string) => {
      dispatch({ action: 'SWITCH', switchTo });
      window.history.back();
    }, [ dispatch ]),

    onDescToggle: useCallback((source: ISource) => setEdit(source), [ setEdit ]),

    doUpdate: useCallback((newDesc: string) => dispatch({
      action: 'UPDATE',
      source: { ...edit, desc: newDesc }
    }), [ edit, dispatch ]),

    doRemove: useCallback((source: ISource) => dispatch({ action: 'REMOVE', source }), [ dispatch ])
  };
};

const DataSourceDropdown: FC = () => {
  const showDesc = useState<boolean>(false);
  const [ edit, setEdit ] = useState({ uid: '', desc: '' });
  const { sourceKey, sources, dispatch } = useSource();
  const { onSwitch, onDescToggle, doUpdate, doRemove } = useEvents({ edit, setEdit, dispatch });

  return (
    <div>
      <SourceDesc show={ showDesc } desc={ edit.desc } onChange={ doUpdate } />

      <BsDropdown onSelect={ onSwitch } Toggle={ sources.reduce((desc: string, src) =>
        src.uid === sourceKey ? src.desc : desc, ''
      )}>
        { sources.map(({ uid, desc }) => 'MY_RECORD' === desc ?
          <BsOption key={ uid } value={ uid } desc={ desc } />
        : (
          <BsOption key={ uid } value={ uid } desc={ desc }>
            <SourceDescToggle show={ showDesc } className="btn btn-link text-info" onToggle={ () => onDescToggle({ uid, desc }) } />

            <button type="button" className="btn btn-link text-danger" onClick={ () => doRemove({ uid, desc }) }>
              <i className="fa fa-remove" />
            </button>
          </BsOption>
        ))}
      </BsDropdown>
    </div>
  );
};

export default DataSourceDropdown;
