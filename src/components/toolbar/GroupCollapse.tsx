import React, { FC, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import Numeral from 'numeral';

import { useLoading } from '../../services/loading';
import { useMessage } from '../../services/message';
import { useRecord, IRecordData, ISummary, getSummary } from '../../services/store/record';

import { BsContainer, BsRow, BsCol } from '../grid';

import RecordGroup, { RecordGroupToggle } from '../editor/RecordGroup';
import AmountSlidebar from './AmountSlidebar';


// TODO: Types
interface IEventInput {
  list: IRecordData[];
  expanded: [ boolean, Dispatch<SetStateAction<boolean>> ];
}

interface IGroupProps {
  cycle: 'day' | 'month' | 'year';
  groupName?: string;
  list: IRecordData[];
}

// TODO: Events
const useEvents = ({ list, expanded: [ expanded, setExpanded ] }: IEventInput) => {
  const { isLoading, Loading } = useLoading();
  const { Message } = useMessage();
  const { dispatch } = useRecord();

  return {
    doCollapse: useCallback(() => setExpanded(!expanded), [ expanded, setExpanded ]),

    doSlideAll: useCallback((turnon: boolean) => list.forEach(record => dispatch({
      action: 'UPDATE',
      params: { ...record, status: turnon ? 'actual' : 'expected' }
    })), [ list, dispatch ]),

    doUpdateGroup: useCallback((value: string) => isLoading ? null : Loading({
      show: true,
      callbackFn: () => {
        let count = 0;

        list.forEach(record => dispatch({
          action: 'UPDATE',
          params: { ...record, group: value },
          fail: (e: Error) => Loading({
            show: false,
            callbackFn: () => Message({ type: 'DANGER', content: e.message })
          }),
          success: () => Loading({
            show: false,
            callbackFn: () => {
              count++;

              if (count === list.length) Message({
                type: 'INFO',
                content: 'MSG_SAVE_SUCCESS'
              });
            }
          })
        }));
      }
    }), [ Message, Loading, isLoading, dispatch, list ])
  };
};

// TODO: Component
const GroupCollapse: FC<IGroupProps> = ({ cycle, groupName = 'UNGROUP', list }) => {
  const actualCount = list.filter(({ status }) => 'actual' === status).length;
  const status = actualCount === list.length ? 1 : actualCount === 0 ? 0 : .5;
  const intl = useIntl();
  const showGroup = useState<boolean>(false);
  const expanded = useState<boolean>(true);
  const sum = getSummary({ cycle, list, ignore: true }) as ISummary;
  const { doCollapse, doSlideAll, doUpdateGroup } = useEvents({ list, expanded });

  return (
    <BsContainer margin={{ y: 3 }}>
      <RecordGroup show={ showGroup } group={ 'UNGROUP' === groupName ? '' : groupName } onChange={ doUpdateGroup } />

      <BsRow>
        <BsCol tagName="fieldset" className="group-title" width={{ sm: 8, md: 6 }}
          border={{ t: true }} colors={{ border: 'warning' }}>

          <legend>
            { 'UNGROUP' === groupName ? <span className="p-2 text-warning">{ intl.messages.UNGROUP }</span> :
              <button type="button" className="btn btn-link text-warning" onClick={ doCollapse }>
                <i className={ `mr-2 fa fa-${ expanded[0] ? 'minus' : 'plus' }-square-o` } />
                { groupName }
              </button>
            }

            { 'UNGROUP' === groupName ? null : (
              <RecordGroupToggle show={ showGroup } icon="fa fa-pencil-square" className="btn btn-link text-info" />
            )}
          </legend>
        </BsCol>
      </BsRow>

      { !expanded[0] ?
        (<BsRow align="center">
          <BsCol width={{ def: 12, sm: 10, lg: 8 }} margin={{ t: 3, b: 1 }}>
            <table className="table table-dark table-striped table-hover text-right">
              <thead>
                <tr>
                  <Fmsg tagName="th" id="INCOME" />
                  <Fmsg tagName="th" id="EXPENSES" />
                  <Fmsg tagName="th" id="DEPOSIT" />
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{ Numeral(sum.income).format('0,0') }</td>
                  <td>{ Numeral(sum.expenses).format('0,0') }</td>
                  <td>{ Numeral(sum.deposit).format('0,0') }</td>
                </tr>
              </tbody>
            </table>

            <input type="range" className="custom-range group" min="0" max="1"
              step={ actualCount > 0 && actualCount < list.length ? .5 : 1 }
              value={ status } onChange={({ target: { value }}) => doSlideAll(value === '1')} />
          </BsCol>
        </BsRow>) :
        
        list.map((record, i) => <BsRow key={`record-${ record.uid }`} align="center">
          <BsCol width={{ def: 12, sm: 10, lg: 8 }} margin={{ t: 3, b: 1 }} border={
            i === (list.length - 1) ? false : { b: true }
          }>
            <AmountSlidebar record={ record } />
          </BsCol>
        </BsRow>
      )}
    </BsContainer>
  );
};

export default GroupCollapse;
