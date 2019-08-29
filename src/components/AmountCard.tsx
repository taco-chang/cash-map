import React, { FC, useCallback } from 'react';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Numeral from 'numeral';

import { IRecordData, useRecord } from '../services/store/record';
import { useLoading } from '../services/loading';
import { BTN, useMessage } from '../services/message';

import { BsContainer, BsRow, BsCol } from './grid';


// TODO: Types
interface IEventInput {
  record: IRecordData;
}

// TODO: Events
const useEvents = ({ record }: IEventInput) => {
  const { Loading } = useLoading();
  const { dispatch } = useRecord();
  const { Message } = useMessage();

  return {
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
  }
};

// TODO: Component
const AmountCard: FC<{ record: IRecordData; }> = ({ record }) => {
  const intl = useIntl();
  const { doRemove } = useEvents({ record });

  return (
    <div className="card amount-card">
      <div className={ `card-header bg-${ 'income' === record.type ? 'primary' : 'expenses' === record.type ? 'danger' : 'info' }` }>
        <Link className="mr-2" to={ `/update/${ record.uid }` }>
          <i className="fa fa-pencil" />
        </Link>

        { record.desc }

        <button type="button" className="ml-auto btn btn-link p-0" onClick={ doRemove }>
          <i className="fa fa-times" />
        </button>
      </div>

      <div className="card-body text-dark">
        <BsContainer tagName="form">
          <BsRow className="text-center">
            <BsCol className="form-group border-right">
              <Fmsg tagName="label" id="AMOUNT_CYCLE" />
              <span className="d-block">{ intl.messages[`CYCLE_${ (record.cycle || '').toUpperCase() }`] }</span>
            </BsCol>
            
            <BsCol className="form-group">
              <Fmsg tagName="label" id="AMOUNT" />
              <span className="d-block">$ { Numeral(record.amount).format('0,0') }</span>
            </BsCol>
          </BsRow>
        </BsContainer>
      </div>
    </div>
  );
};

export default AmountCard;
