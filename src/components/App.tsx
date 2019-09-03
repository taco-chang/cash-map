import React, { Dispatch, SetStateAction, FC, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';

import { useLoading } from '../services/loading';
import { BTN, useMessage } from '../services/message';
import { useRecord } from '../services/store/record';

import { BsContainer, BsRow, BsCol } from './grid';
import { BsInlineGroup } from './form';

import SumDashboard from './toolbar/SumDashboard';
import GroupCollapse from './toolbar/GroupCollapse';

import TypeDropdown from './editor/TypeDropdown';


// TODO: Types
interface IEventInput {
  summaryCycle: 'day' | 'month' | 'year';
  setFilter: Dispatch<SetStateAction<string>>;
}

// TODO: Events
const useEvents = ({ summaryCycle, setFilter }: IEventInput) => {
  const [ loaded, setLoaded ] = useState<boolean>(false);
  const { Loading } = useLoading();
  const { Message } = useMessage();
  const { dispatch } = useRecord();

  useEffect(() => {
    if (!loaded) Loading({
      show: true,
      callbackFn: () => dispatch({
        action: 'SUMMARY',
        params: { cycle: summaryCycle },
        fail: (e: Error) => Loading({
          show: false,
          callbackFn: () => Message({ type: 'DANGER', content: e.message })
        }),
        success: () => dispatch({
          action: 'LIST',
          fail: (e: Error) => Loading({
            show: false,
            callbackFn: () => Message({ type: 'DANGER', content: e.message })
          }),
          success: () => Loading({
            show: false,
            callbackFn: () => setLoaded(true)
          })
        })
      })
    });
  }, [ Loading, Message, summaryCycle, loaded, setLoaded, dispatch ]);

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

// TODO: Component - APP
const App: FC = () => {
  const intl = useIntl();
  const [ filter, setFilter ] = useState('all');
  const { store: { summary, list } } = useRecord();
  const { onCycleChange, onFilterChange, doClear } = useEvents({ summaryCycle: summary.cycle, setFilter });

  return (
    <div>
      <SumDashboard summary={ summary } cycle={ summary.cycle } onCycleChange={ onCycleChange } />

      { Object.keys(list).map(group =>
        <GroupCollapse key={ group } groupName={ group } list={ list[group] } />
      )}

      <BsContainer className="list-fbar">
        <BsRow padding={{ t: 3 }}>
          <BsCol className="form-group">
            <Fmsg tagName="label" id="FILTER_MAINTAIN" />

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
