import React, { FC, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Numeral from 'numeral';

import { useLoading } from '../services/loading';
import { BTN, useMessage } from '../services/message';
import { IRecordData, useRecord } from '../services/store/record';


// TODO: Types
interface IEventInput {
  record: IRecordData;
}

// TODO: Events
const useEvents = ({ record }: IEventInput) => {
  const { Loading } = useLoading();
  const { Message } = useMessage();
  const { dispatch } = useRecord();

  return {
    onSlide: useCallback((turnon: boolean) => dispatch({
      action: 'UPDATE',
      params: { ...record, status: turnon ? 'actual' : 'expected' }
    }), [ record, dispatch ]),

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
    }), [ Message, Loading, dispatch, record ])
  };
}

// TODO: Components
const AmountSlidebar: FC<{ record: IRecordData; }> = ({ record }) => {
  const intl = useIntl();
  const { onSlide, doRemove } = useEvents({ record });

  return (
    <div className="form-group amount-slidebar">
      <label className="media">
        <Link className="mr-3" to={ `/update/${ record.uid }` }>
          <i className="fa fa-pencil" />
        </Link>
        
        <span className="media-body">
          <button type="button" className="close text-white" onClick={ doRemove }>
            <i className="fa fa-trash-o" />
          </button>

          <h4>{ record.desc }</h4>
          $ { Numeral(record.amount).format('0,0') } / { intl.messages[`CYCLE_${ (record.cycle || '').toUpperCase() }`] }
        </span>
      </label>

      <input type="range" className={ `custom-range ${ record.type  }` } min="0" max="1"
        value={ 'actual' === record.status ? 1 : 0 } onChange={({ target: { value }}) => onSlide(value === '1')} />
    </div>
  );
};

export default AmountSlidebar;
