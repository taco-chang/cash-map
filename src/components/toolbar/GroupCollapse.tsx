import React, { FC, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useIntl } from 'react-intl';

import { useLoading } from '../../services/loading';
import { useMessage } from '../../services/message';
import { useRecord, IRecordData } from '../../services/store/record';

import { BsContainer, BsRow, BsCol } from '../grid';

import RecordGroup, { RecordGroupToggle } from '../editor/RecordGroup';
import AmountSlidebar from './AmountSlidebar';


// TODO: Types
interface IEventInput {
  list: IRecordData[];
  expanded: [ boolean, Dispatch<SetStateAction<boolean>> ];
}

// TODO: Events
const useEvents = ({ list, expanded: [ expanded, setExpanded ] }: IEventInput) => {
  const { isLoading, Loading } = useLoading();
  const { Message } = useMessage();
  const { dispatch } = useRecord();

  return {
    doCollapse: useCallback(() => setExpanded(!expanded), [ expanded, setExpanded ]),

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
const GroupCollapse: FC<{ groupName?: string; list: IRecordData[]; }> = ({ groupName = 'UNGROUP', list }) => {
  const intl = useIntl();
  const showGroup = useState<boolean>(false);
  const expanded = useState<boolean>(true);
  const { doCollapse, doUpdateGroup } = useEvents({ list, expanded });

  return (
    <BsContainer margin={{ y: 3 }}>
      <RecordGroup show={ showGroup } group={ 'UNGROUP' === groupName ? '' : groupName } onChange={ doUpdateGroup } />

      <fieldset className="group-title border-top border-warning col-12 col-sm-8 col-md-6">
        <legend>
          <button type="button" className="btn btn-link text-warning" onClick={ doCollapse }>
            <i className={ `mr-2 fa fa-${ expanded ? 'minus' : 'plus' }-square-o` } />
            { 'UNGROUP' === groupName ? intl.messages.UNGROUP : groupName }
          </button>

          <RecordGroupToggle show={ showGroup } icon="fa fa-pencil-square" className="btn btn-link text-info" />
        </legend>
      </fieldset>

      { !expanded[0] ? null : list.map((record, i) =>
        <BsRow key={`record-${ record.uid }`} align="center">
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
