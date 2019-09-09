import React, { FC, Dispatch, SetStateAction, FormEvent, ChangeEvent, useCallback, useState } from  'react';

import BsModal, { BTN } from '../bs/BsModal';


// TODO: Types
const SAVE_SYMBOL = Symbol('SAVE');

type ShowModal = [ boolean, Dispatch<SetStateAction<boolean>> ];

interface IEventInput {
  value: string;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
}

interface IToggleProps {
  show: ShowModal;
  className?: string;
  icon?: string;
  onToggle?: () => void;
}

interface IModalProps {
  show: ShowModal;
  desc: string;
  onChange: (value: string) => void;
}


// TODO: Events
const useEvents = ({ value, setValue, onChange }: IEventInput) => {
  return {
    onInputChange: useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [ setValue ]),

    onModalCallback: useCallback((btn: BTN | symbol) => {
      if (SAVE_SYMBOL === btn)
        onChange(value);
    }, [ value, onChange ]),
    
    doStopSubmit: useCallback((e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      onChange(value);
    }, [ value, onChange ])
  };
};


// TODO: Components
export const SourceDescToggle: FC<IToggleProps> = ({
  show,
  className = '',
  icon = 'fa fa-pencil-square-o',
  onToggle = () => {}
}) => {
  const onOpenDesc = useCallback(() => {
    show[1](true);
    onToggle();
  }, [ show, onToggle ]);

  return (
    <button type="button" className={ className } onClick={ onOpenDesc }>
      <i className={ icon } />
    </button>
  );
};

const SourceDesc: FC<IModalProps> = ({ show, desc, onChange }) => {
  const [ value, setValue ] = useState(desc);
  const { onInputChange, onModalCallback, doStopSubmit } = useEvents({ value, setValue, onChange });

  return (
    <BsModal className="bg-secondary" show={ show } closeByBtn doCallback={ onModalCallback } title={{
      icon: 'fa fa-pencil-square-o',
      text: 'TITLE_SET_DESC'
    }} btns={[
      { code: BTN.DISMISS, icon: 'fa fa-ban', text: 'CANCEL' },
      { code: SAVE_SYMBOL, icon: 'fa fa-download', text: 'CONFIRM' }
    ]}>
      <form onSubmit={ doStopSubmit }>
        <input type="text" className="form-control" value={ value } onChange={ onInputChange } />
      </form>
    </BsModal>
  );
};

const Modal: FC<IModalProps> = (props) => {
  const { show: [ isShow ]} = props;

  return !isShow ? null : <SourceDesc {...props} />;
};

export default Modal;
