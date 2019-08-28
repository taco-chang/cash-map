import React, { FC, MouseEvent, TouchEvent, useState, useCallback, useEffect } from 'react';
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

interface IEventOutput {
  onSlideByMouse: (e: MouseEvent) => void;
  onSlideByTouch: (e: TouchEvent) => void;
  doRemove: () => void;
}

// TODO: Events
const useEvents = ({ record }: IEventInput): IEventOutput => {
  const [ slideOn, setSlideOn ] = useState<boolean>(false);
  const [ startX, setStartX ] = useState(0);
  const { setLoading } = useLoading();
  const { dispatch } = useRecord();
  const { dispatch: Msg } = useMessage();
  const onSlideEnd = useCallback((finishX: number) => {
    if (!record.mapTurnOn && finishX < startX)
      dispatch({ action: 'UPDATE', params: { ...record, mapTurnOn: true }});
    else if (record.mapTurnOn && finishX > startX)
      dispatch({ action: 'UPDATE', params: { ...record, mapTurnOn: false }});

    setSlideOn(false);
  }, [ record, startX, dispatch, setSlideOn ]);

  useEffect(() => {
    if (slideOn === true) $(document.body)
      .on('mouseup', ({ clientX }) => onSlideEnd(clientX))
      .on('touchend', ({ changedTouches: { 0: { clientX }}}) => onSlideEnd(clientX));

    return () => { $(document.body).off('mouseup').off('touchend'); };
  }, [ slideOn, onSlideEnd ]);

  return {
    onSlideByMouse: useCallback(({ clientX }: MouseEvent) => {
      setStartX(clientX);
      setSlideOn(true);
    }, [ setStartX, setSlideOn ]),

    onSlideByTouch: useCallback(({ changedTouches: { 0:{ clientX }}}: TouchEvent) => {
      setStartX(clientX);
      setSlideOn(true);
    }, [ setStartX, setSlideOn ]),

    doRemove: useCallback(() => Msg({
      type    : 'CONFIRM',
      title   : 'MSG_CONFIRM_TITLE',
      icon    : 'fa fa-question',
      content : 'MSG_REMOVE_QUESTION',
      handler : btn => BTN.CONFIRM !== btn ? null : setLoading({
        show: true,
        callbackFn: () => dispatch({
          action: 'REMOVE',
          params: record,
          fail: (e: Error) => setLoading({
            show: false,
            callbackFn: () => Msg({ type: 'DANGER', content: e.message })
          }),
          success: () => setLoading({
            show: false,
            callbackFn: () => Msg({ type: 'INFO', content: 'MSG_REMOVE_SUCCESS' })
          })
        })
      })
    }), [ Msg, setLoading, dispatch, record ])
  }
};

// TODO: Component
const AmountCard: FC<{ record: IRecordData; isMap?: boolean; }> = ({ record, isMap = false }) => {
  const intl = useIntl();
  const { onSlideByMouse, onSlideByTouch, doRemove } = useEvents({ record });

  return (
    <div className={ `card amount-card ${ !isMap ? '' : `calculate-${ record.mapTurnOn ? 'on' : 'off' }`}`}
      onMouseDown={ onSlideByMouse } onTouchStart={ onSlideByTouch }>
      <div className={ `card-header bg-${ 'income' === record.type ? 'primary' : 'expenses' === record.type ? 'danger' : 'info' }` }>
        <Link className="mr-2" to={ `/update/${ record.uid }` }>
          <i className="fa fa-pencil" />
        </Link>

        { record.desc } { isMap || 'expected' !== record.status ? null : `(${ intl.messages.EXPECTED })` }

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
