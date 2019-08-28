import React, { FC } from 'react';
import { useIntl } from 'react-intl';

// TODO: Types
interface IProps {
  className?: string;
  disableOnce?: boolean;
  value: string;
  onChange: (value: string) => void;
}

// TODO: Components
const CycleDropdown: FC<IProps> = ({ value, onChange, className = '', disableOnce = false }) => {
  const intl = useIntl();

  return (
    <select className={ `form-control ${ className }`} value={ value } onChange={
      ({ target }) => onChange(target.value)
    }>
      { disableOnce ? null : (
        <option value="once">{ intl.messages.CYCLE_ONCE }</option>
      )}
      <option value="day">{ intl.messages.CYCLE_DAY }</option>
      <option value="month">{ intl.messages.CYCLE_MONTH }</option>
      <option value="year">{ intl.messages.CYCLE_YEAR }</option>
    </select>
  );
};

export default CycleDropdown;