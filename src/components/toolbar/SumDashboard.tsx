import React, { FC, useState, useCallback } from 'react';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import Numeral from 'numeral';

import { ISummary } from '../../services/store/record';

import { BsContainer, BsRow, BsCol } from '../grid';
import { BsInlineGroup } from '../form';

import CycleDropdown from '../editor/CycleDropdown';


// TODO: Component
const SumDashboard: FC<{
  summary: ISummary;
  cycle: 'day' | 'month' | 'year';
  onCycleChange: (value: 'day' | 'month' | 'year') => void
}> = ({ summary, cycle, onCycleChange }) => {
  const intl = useIntl();
  const labelWidth = 'zh' === intl.locale ? 60 : 110;
  const [ expanded, setExpanded ] = useState<boolean>(false);
  const doCollapse = useCallback(() => setExpanded(!expanded), [ expanded, setExpanded ]);

  return (
    <fieldset className={ `summary-dashboard shadow ${ expanded ? 'sd-expand' : 'sd-collapse' }` }>
      <legend>
        <button type="button" className="btn btn-link" onClick={ doCollapse }>
          <i className={ `mr-2 fa fa-${ expanded ? 'minus' : 'plus' }-square-o` } />
          { intl.messages.SUMMARY } ({ intl.messages[ `CYCLE_${ cycle.toUpperCase() }` ] })
        </button>
      </legend>

      { !expanded ? (
        <BsContainer tagName="form">
          <BsRow className="text-right">
            <BsCol className="form-group">
              <Fmsg tagName="label" id="APPLICABLE" />
              <span className="d-block">$ { Numeral(summary.applicable).format('0,0') }</span>
            </BsCol>

            <BsCol className="form-group">
              <Fmsg tagName="label" id="DEPOSIT" />
              <span className="d-block">$ { Numeral(summary.deposit).format('0,0') }</span>
            </BsCol>
          </BsRow>
        </BsContainer>
      ) : (
        <BsContainer tagName="form">
          <BsRow>
            <BsCol className="form-group" width={{ sm: 6 }}>
              <Fmsg tagName="label" id="VIEW_CYCLE" />

              <CycleDropdown value={ cycle } disableOnce onChange={
                value => onCycleChange(value as 'day' | 'month' | 'year')
              } />
            </BsCol>
          </BsRow>

          <BsRow>
            <BsCol width={{ def: 12, sm: 6 }}>
              <BsInlineGroup label={ intl.messages.INCOME } labelWidth={ labelWidth }>
                <span className="form-control text-right">$ { Numeral(summary.income).format('0,0') }</span>
              </BsInlineGroup>
            </BsCol>

            <BsCol width={{ def: 12, sm: 6 }}>
              <BsInlineGroup label={ intl.messages.EXPENSES } labelWidth={ labelWidth }>
                <span className="form-control text-right">$ { Numeral(summary.expenses).format('0,0') }</span>
              </BsInlineGroup>
            </BsCol>

            <BsCol width={{ def: 12, sm: 6 }}>
              <BsInlineGroup label={ intl.messages.DEPOSIT } labelWidth={ labelWidth }>
                <span className="form-control text-right">$ { Numeral(summary.deposit).format('0,0') }</span>
              </BsInlineGroup>
            </BsCol>

            <BsCol width={{ def: 12, sm: 6 }}>
              <BsInlineGroup label={ intl.messages.APPLICABLE } labelWidth={ labelWidth }>
                <span className="form-control text-right">$ { Numeral(summary.applicable).format('0,0') }</span>
              </BsInlineGroup>
            </BsCol>
          </BsRow>
        </BsContainer>
      )}
    </fieldset>
  );
};

export default SumDashboard;
