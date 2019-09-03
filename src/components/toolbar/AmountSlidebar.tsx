import React, { FC, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Numeral from 'numeral';

import { useLoading } from '../../services/loading';
import { BTN, useMessage } from '../../services/message';
import { IRecordData, useRecord } from '../../services/store/record';

import RecordGroup, { RecordGroupToggle } from '../editor/RecordGroup';


// TODO: Types
interface IEventInput {
  record: IRecordData;
}

// TODO: Events
const useEvents = ({ record }: IEventInput) => {
  const { isLoading, Loading } = useLoading();
  const { Message } = useMessage();
  const { dispatch } = useRecord();

  return {
    onSlide: useCallback((turnon: boolean) => dispatch({
      action: 'UPDATE',
      params: { ...record, status: turnon ? 'actual' : 'expected' }
    }), [ record, dispatch ]),

    doUpdateGroup: useCallback((value: string) => isLoading ? null : Loading({
      show: true,
      callbackFn: () => dispatch({
        action: 'UPDATE',
        params: { ...record, group: value || '' },
        fail: (e: Error) => Loading({
          show: false,
          callbackFn: () => Message({ type: 'DANGER', content: e.message })
        }),
        success: () => Loading({
          show: false,
          callbackFn: () => Message({ type: 'INFO', content: 'MSG_SAVE_SUCCESS' })
        })
      })
    }), [ Loading, Message, dispatch, isLoading, record ]),

    doRemove: useCallback(() => Message({
      type    : 'CONFIRM',
      title   : 'MSG_CONFIRM_TITLE',
      icon    : 'fa fa-question',
      content : 'MSG_REMOVE_QUESTION',
      handler : btn => BTN.CONFIRM !== btn ? null : Loading({
        show: true,
        callbackFn: () => dispatch({
          action: 'REMOVE',
          params: record,
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
    }), [ Loading, Message, dispatch, record ])
  };
}

// TODO: Components
const AmountSlidebar: FC<{ record: IRecordData; }> = ({ record }) => {
  const intl = useIntl();
  const showGroup = useState<boolean>(false);
  const { onSlide, doUpdateGroup, doRemove } = useEvents({ record });

  return (
    <div className="form-group amount-slidebar">
      <RecordGroup show={ showGroup } group={ record.group || '' } onChange={ doUpdateGroup } />

      <div className="media">
        <div className="btn-group-vertical">
          <Link className="mr-3 btn btn-link text-info" to={ `/update/${ record.uid }` }>
            <i className="fa fa-pencil-square-o" />
          </Link>

          <RecordGroupToggle show={ showGroup } className="btn btn-link text-warning" />
        </div>
        
        <span className="media-body py-2">
          <h4>{ record.desc }</h4>
          $ { Numeral(record.amount).format('0,0') } / { intl.messages[`CYCLE_${ (record.cycle || '').toUpperCase() }`] }
        </span>

        <button type="button" className="btn btn-link text-white mt-2" onClick={ doRemove }>
          <i className="fa fa-trash-o" />
        </button>
      </div>

      <input type="range" className={ `custom-range ${ record.type  }` } min="0" max="1"
        value={ 'actual' === record.status ? 1 : 0 } onChange={({ target: { value }}) => onSlide(value === '1')} />
    </div>
  );
};

export default AmountSlidebar;
