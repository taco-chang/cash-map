import React, {
  FC,
  Dispatch,
  FormEvent,
  ChangeEvent,
  SetStateAction,
  useState,
  useCallback,
  useEffect
} from 'react';

import { useRecord } from '../../services/store/record';

import BsModal, { BTN } from '../modal';
import BsDropdown, { BsOption } from './BsDropdown';


// TODO: Types
const SAVE_SYMBOL = Symbol('SAVE');

export type ShowModal = [ boolean, Dispatch<SetStateAction<boolean>> ];

interface IEventInput {
  group: string;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
}

interface IProps {
  show: ShowModal;
  group: string;
  onChange: (value: string) => void;
}

// TODO: Events
const useEvents = ({ group, setValue, onChange }: IEventInput) => {
  const { dispatch } = useRecord();
  const [ getGroup, setGroup ] = useState<boolean>(false);

  useEffect(() => {
    if (!getGroup) dispatch({
      action: 'GROUP',
      success: () => setGroup(true)
    });
  }, [ getGroup, setGroup, dispatch ]);

  return {
    onFilterChange: useCallback(({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
      setValue(value);
    }, [ setValue ]),

    onSelectGroup: useCallback((value: any) => setValue(value as string), [ setValue ]),

    onModalCallback: useCallback((btn: BTN | symbol) => {
      if (SAVE_SYMBOL === btn)
        onChange(group);
    }, [ group, onChange ]),
    
    doStopSubmit: useCallback((e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      onChange(group);
    }, [ group, onChange ])
  };
};

// TODO: Components
const RecordGroup: FC<IProps> = ({ show, group, onChange }) => {
  const [ value, setValue ] = useState(group);
  const { store: { group: groups }} = useRecord();

  const {
    onFilterChange,
    onSelectGroup,
    onModalCallback,
    doStopSubmit
  } = useEvents({ group: value, setValue, onChange });

  return (
    <BsModal className="bg-secondary" show={ show } closeByBtn title={{
      icon: 'fa fa-object-ungroup',
      text: 'TITLE_SET_GROUP'
    }} btns={[
      { code: BTN.DISMISS, icon: 'fa fa-ban', text: 'CANCEL' },
      { code: SAVE_SYMBOL, icon: 'fa fa-download', text: 'CONFIRM' }
    ]} doCallback={ onModalCallback }>
      <form onSubmit={ doStopSubmit }>
        <BsDropdown onSelect={ onSelectGroup } Toggle={
          <input type="text" className="form-control" value={ value } onChange={ onFilterChange } />
        }>
          {(alloweds => alloweds.length === 0 ?
            <BsOption value={ value } /> : alloweds.map($group =>
              <BsOption key={ $group } value={ $group } />
            )
          )(groups.filter($group => $group.indexOf(value) >= 0))}
        </BsDropdown>
      </form>
    </BsModal>
  );
}

export default RecordGroup;