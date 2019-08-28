import React, { FC, useState, useCallback, useEffect } from 'react';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import Numeral from 'numeral';

import { ISummary, useRecord } from '../services/store/record';

import { BsContainer, BsRow, BsCol } from './grid';
import { BsInlineGroup } from './form';
import AmountCard from './AmountCard';


// TODO: Summary Dashboard
const SummaryDashboard: FC<{
  summary: ISummary;
  cycle: 'day' | 'month' | 'year';
  onCycleChange: (value: 'day' | 'month' | 'year') => void
}> = ({ summary, cycle, onCycleChange }) => {
  const intl = useIntl();
  const labelWidth = 'zh' === intl.locale ? 60 : 110;
  const [ expanded, setExpanded ] = useState<boolean>(false);
  const { dispatch } = useRecord();

  const doCollapse = useCallback(() => setExpanded(!expanded), [ expanded, setExpanded ]);
  const doClear = useCallback(() => dispatch({ action: 'CLEAR' }), [ dispatch ]);

  return (
    <fieldset className={ `summary-dashboard shadow ${ expanded ? 'sd-expand' : 'sd-collapse' }` }>
      <legend>
        <button type="button" className="btn btn-link" onClick={ doCollapse }>
          { intl.messages.SUMMARY } ({ intl.messages[ `CYCLE_${ cycle.toUpperCase() }` ] })
          <i className={ `ml-2 fa fa-${ expanded ? 'minus' : 'plus' }-square-o` } />
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

              <select className="form-control" value={ cycle } onChange={({ target: { value }}) =>
                onCycleChange(value as 'day' | 'month' | 'year')
              }>
                <option value="day">{ intl.messages.CYCLE_DAY }</option>
                <option value="month">{ intl.messages.CYCLE_MONTH }</option>
                <option value="year">{ intl.messages.CYCLE_YEAR }</option>
              </select>
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

          <BsRow margin={{ t: 5 }}>
            <BsCol className="text-right">
              <button type="button" className="btn btn-danger" onClick={ doClear }>
                <i className="fa fa-plus mr-2" />
                <Fmsg id="CLEAR" />
              </button>
            </BsCol>
          </BsRow>
        </BsContainer>
      )}
    </fieldset>
  );
};

// TODO: Main Component
const App: FC = () => {
  const { store: { summary, sumcycle, target: { list } }, dispatch } = useRecord();

  const onCycleChange = useCallback((value: 'day' | 'month' | 'year') => dispatch({
    action: 'SUMMARY',
    params: { cycle: value }
  }), [ dispatch ]);

  useEffect(() => dispatch({
    action: 'ALL',
    success: () => dispatch({ action: 'LIST', params: { status: 'expected' }})
  }), [ dispatch ]);

  return (
    <div>
      <h4 className="page-title"><Fmsg tagName="strong" id="CASH_MAP" /></h4>
      <SummaryDashboard summary={ summary } cycle={ sumcycle } onCycleChange={ onCycleChange } />

      <BsContainer>
        { list.map(record =>
          <BsRow key={`record-${ record.uid }`} align="center">
            <BsCol width={{ def: 12, sm: 10, lg: 8 }}>
              <AmountCard record={ record } isMap />
            </BsCol>
          </BsRow>
        )}
      </BsContainer>
    </div>
  );
};

export default App;
