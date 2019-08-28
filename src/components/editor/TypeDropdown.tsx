import React, { FC, ReactNode } from 'react';
import { useIntl } from 'react-intl';


// TODO: Types
interface IProps {
  children?: ReactNode;
  className?: string;
  disableDeposit?: boolean;
  value: string;
  onChange: (value: string) => void;
}

// TODO: Components
const TypeDropdown: FC<IProps> = ({
  className = '',
  disableDeposit = false,
  children,
  value,
  onChange
}) => {
  const intl = useIntl();

  return (
    <select className={ `form-control ${ className }`} value={ value } onChange={
      ({ target }) => onChange(target.value)
    }>
      { children }
      <option value="income">{ intl.messages.INCOME }</option>
      <option value="expenses">{ intl.messages.EXPENSES }</option>

      { disableDeposit ? null : (
        <option value="deposit">{ intl.messages.DEPOSIT }</option>
      )}
    </select>
  );
};

export default TypeDropdown;
