import React, { FC, KeyboardEvent, ReactElement, ReactNode, useCallback } from 'react';
import { useIntl } from 'react-intl';

import { BsInlineGroup } from './BsForm';
import { BsColor, getTextColor } from '../../@types/bs.types';


// TODO: Types
interface IDropdownEventInput {
  onSelect: (value: any) => void;
}

interface IOptionEventInput extends IDropdownEventInput {
  value: any;
  disabled: boolean;
}

interface IOptionProps {
  className?: string;
  value: any;
  icon?: string;
  desc?: string;
  disabled?: boolean;
  children?: ReactNode;
  onSelect?: (value: any) => void;
}

interface IDropdownProps {
  Toggle: ReactElement | string;
  children?: ReactElement | ReactElement[];
  color?: BsColor;
  onSelect?: (value: any) => void;
}

// TODO: Events
const useOptionEvents = ({ value, disabled, onSelect }: IOptionEventInput) => {
  return {
    onSelectOption: useCallback(() => disabled ? null : onSelect(value), [ value, disabled, onSelect ]),

    onPressEnter: useCallback(({ key }: KeyboardEvent) => 'Enter' !== key ? null : onSelect(value), [ value, onSelect ])
  };
};

const useDropdownEvents = ({ onSelect }: IDropdownEventInput) => {
  return {
    onSelectOption: useCallback((value: any) => onSelect(value), [ onSelect ])
  }
};

// TODO: Components
export const BsOption: FC<IOptionProps> = ({
  className = '',
  value,
  icon,
  desc = value,
  disabled = false,
  children,
  onSelect = () => {}
}) => {
  const intl = useIntl();
  const { onSelectOption, onPressEnter } = useOptionEvents({ value, disabled, onSelect });

  return (
    <BsInlineGroup>
      <button type="button" disabled={ disabled } className={ `dropdown-item form-control ${ className }` }
        onClick={ onSelectOption } onKeyPress={ onPressEnter }>

        { !icon ? null : (<i className={ `${ icon } mr-2` } />)}
        { desc in intl.messages ? intl.messages[ desc ] : desc }
      </button>

      { children }
    </BsInlineGroup>
  );
};

const BsDropdown: FC<IDropdownProps> = ({ Toggle, children = [], color = 'light', onSelect = () => {}}) => {
  const intl = useIntl();
  const options = Array.isArray(children) ? children : [ children ];
  const { onSelectOption } = useDropdownEvents({ onSelect });

  return (
    <div className="dropdown">
      { 'string' !== typeof Toggle ? (
        <Toggle.type {...{ ...Toggle.props, className: `${ Toggle.props.className || '' } dropdown-toggle` }} data-toggle="dropdown" />
      ) : (
        <button type="button" className={ `btn btn-${ color } dropdown-toggle w-100 text-left` } data-toggle="dropdown">
          { Toggle in intl.messages ? intl.messages[ Toggle ] : Toggle }
        </button>
      )}

      <div className={ `dropdown-menu w-100 bg-${ color } text-${ getTextColor(color) }` }>
        { options.length === 0 ? <BsOption disabled value="OPTION_NOT_FOUND" /> : options.map(opt =>
          <BsOption key={ opt.key } {...{
            ...opt.props,
            onSelect: onSelectOption
          }}  />
        )}
      </div>
    </div>
  );
};

export default BsDropdown;
