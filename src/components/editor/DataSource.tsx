import React, { Dispatch, FC, useCallback } from 'react';
import { IAction, useSource } from '../../services/store/source';

import BsDropdown, { BsOption } from '../bs/BsDropdown';


// TODO: Types
interface IEventInput {
  dispatch: Dispatch<IAction>;
}

// TODO: Events
const useEvents = ({ dispatch }: IEventInput) => {
  return {
    onSwitch: useCallback((switchTo: string) => {
      dispatch({ action: 'SWITCH', switchTo });
      window.history.back();
    }, [ dispatch ])
  };
};

const DataSourceDropdown: FC = () => {
  const { sourceKey, sources, dispatch } = useSource();
  const { onSwitch } = useEvents({ dispatch });

  return (
    <BsDropdown onSelect={ onSwitch } Toggle={ sources.reduce((desc: string, src) =>
      src.uid === sourceKey ? src.desc : desc, 'XXXXXXx'
    )}>
      { sources.map(({ uid, desc }) =>
        <BsOption key={ uid } value={ uid } desc={ desc } />
      )}
    </BsDropdown>
  );
};

export default DataSourceDropdown;
