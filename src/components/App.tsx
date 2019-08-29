import React, { Dispatch, SetStateAction, FC, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import Numeral from 'numeral';

import { useLoading } from '../services/loading';
import { BTN, useMessage } from '../services/message';
import { ISummary, useRecord } from '../services/store/record';

import { BsContainer, BsRow, BsCol } from './grid';
import { BsInlineGroup } from './form';

import CycleDropdown from './editor/CycleDropdown';
import TypeDropdown from './editor/TypeDropdown';
import AmountSlidebar from './AmountSlidebar';


// TODO: Types
interface IEventInput {
  setFilter: Dispatch<SetStateAction<string>>;
}


// TODO: Events
const useEvents = ({ setFilter }: IEventInput) => {
  const { Loading } = useLoading();
  const { Message } = useMessage();
  const { dispatch } = useRecord();

  useEffect(() => dispatch({
    action: 'ALL',
    success: () => dispatch({ action: 'LIST' })
  }), [ dispatch ]);

  return {
    onCycleChange: useCallback((value: 'day' | 'month' | 'year') => dispatch({
      action: 'SUMMARY',
      params: { cycle: value }
    }), [ dispatch ]),
    
    onFilterChange: useCallback((value: string) => {
      setFilter(value);
      dispatch({ action: 'LIST', params: { type: 'all' === value ? '' : value }})
    }, [ dispatch, setFilter ]),

    doClear: useCallback(() => Message({
      type    : 'CONFIRM',
      title   : 'MSG_CONFIRM_TITLE',
      icon    : 'fa fa-question',
      content : 'MSG_CLEAR_QUESTION',
      handler : btn => BTN.CONFIRM !== btn ? null : Loading({
        show: true,
        callbackFn: () => dispatch({
          action: 'CLEAR',
          fail: (e: Error) => Loading({
            show: false,
            callbackFn: () => Message({ type: 'DANGER', content: e.message })
          }),
          success: () => Loading({
            show: false,
            callbackFn: () => Message({ type: 'INFO', content: 'MSG_REMOVE_SUCCESS' })
          })
        })
      })
    }), [ Loading, Message, dispatch ])
  }
};

// TODO: Component - Summary Dashboard
const SummaryDashboard: FC<{
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

// TODO: Component - APP
const App: FC = () => {
  const intl = useIntl();
  const [ filter, setFilter ] = useState('all');
  const { store: { summary, sumcycle, target: { list } } } = useRecord();
  const { onCycleChange, onFilterChange, doClear } = useEvents({ setFilter });

  return (
    <div>
      <SummaryDashboard summary={ summary } cycle={ sumcycle } onCycleChange={ onCycleChange } />

      <BsContainer margin={{ y: 3 }}>
        { list.map(record =>
          <BsRow key={`record-${ record.uid }`} align="center" border={{ b: true }}>
            <BsCol width={{ def: 12, sm: 10, lg: 8 }} margin={{ t: 3, b: 1 }}>
              <AmountSlidebar record={ record } />
            </BsCol>
          </BsRow>
        )}

        <BsRow className="list-fbar" padding={{ t: 3 }}>
          <BsCol className="form-group">
            <Fmsg tagName="label" id="RECORD_TYPE" />

            <BsInlineGroup>
              <Link className="btn btn-primary" to="/append">
                <i className="fa fa-plus mr-2" /> { intl.messages.APPEND_RECORD }
              </Link>

              <TypeDropdown className="rounded mx-2" value={ filter } onChange={ onFilterChange }>
                <option value="all">{ intl.messages.ALL_OPTION }</option>
              </TypeDropdown>

              <button type="button" className="btn btn-danger" onClick={ doClear }>
                <i className="fa fa-remove mr-2" /> { intl.messages.CLEAR }
              </button>
            </BsInlineGroup>
          </BsCol>
        </BsRow>
      </BsContainer>
    </div>
  );
};

export default App;
