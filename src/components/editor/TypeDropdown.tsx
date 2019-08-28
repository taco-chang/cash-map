import React, { FC, ReactNode } from 'react';
import { useIntl } from 'react-intl';


// TODO: Types
interface IProps {
  children?: ReactNode;
  value: string;
  onChange: (value: string) => void;
}

const TypeDropdown: FC<IProps> = ({ children, value = 'income', onChange = () => {}}) => {
  const intl = useIntl();

  return (
    <select className="form-control" value={ value } onChange={
      ({ target }) => onChange(target.value)
    }>
      { children }
      <option value="income">{ intl.messages.INCOME }</option>
      <option value="expenses">{ intl.messages.EXPENSES }</option>
      <option value="deposit">{ intl.messages.DEPOSIT }</option>
    </select>
  );
};

export default TypeDropdown;
