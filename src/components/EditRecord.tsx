import React, { FC, Dispatch, SetStateAction, FormEvent, useState, useEffect, useCallback } from 'react';
// import DatePicker from 'react-datepicker';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import { match } from 'react-router-dom';

import { BTN, useMessage } from '../services/message';
import { useLoading } from '../services/loading';
import { RecordModel, IRecordData, useRecord } from '../services/store/record';
import { BsContainer, BsRow, BsCol } from './grid';
import TypeDropdown from './editor/TypeDropdown';

import 'react-datepicker/dist/react-datepicker.css';


// TODO: Types
interface IEventInput {
  isXs: boolean;
  asXs: Dispatch<SetStateAction<boolean>>;
  record: RecordModel;
}

interface IEventOutput {
  doStopSubmit: (e: FormEvent) => void;
  doCancel: () => void;
  doCreate: () => void;
  doUpdate: () => void;
}


// TODO: Events
const useEvents = ({ isXs, asXs, record }: IEventInput): IEventOutput => {
  const isSizeChanged = isXs === (window.innerWidth < 576);
  const [ initValue ] = useState(JSON.stringify(record.getJSON()));
  const { setLoading } = useLoading();
  const { dispatch } = useRecord();
  const { dispatch: Msg } = useMessage();

  const doCancel = useCallback(() => {
    record.reset();
    window.history.back();
  }, [ record ]);

  useEffect(() => {
    $(window).on('resize', () => asXs(window.innerWidth < 576));

    return () => { $(window).off('resize') };
  }, [ isSizeChanged, asXs ]);

  return {
    doStopSubmit: useCallback((e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []),

    doCancel: useCallback(() => initValue === JSON.stringify(record.getJSON()) ? doCancel() : Msg({
      type: 'CONFIRM',
      content: 'MSG_MODIFIED_CHECK',
      handler: btn => BTN.CONFIRM === btn ? doCancel() : null
    }), [ Msg, initValue, record, doCancel ]),

    doCreate: useCallback(() => setLoading({
      show: true,
      callbackFn: () => dispatch({
        action: 'CREATE',
        params: record.getJSON(),
        fail: (e: Error) => setLoading({
          show: false,
          callbackFn: () => Msg({ type: 'DANGER', content: e.message })
        }),
        success: () => setLoading({
          show: false,
          callbackFn: () => Msg({ type: 'INFO', content: 'MSG_SAVE_SUCCESS', handler: () => record.reset()})
        })
      })
    }), [ Msg, setLoading, record, dispatch ]),

    doUpdate: useCallback(() => setLoading({
      show: true,
      callbackFn: () => dispatch({
        action: 'UPDATE',
        params: record.getJSON(),
        fail: (e: Error) => setLoading({
          show: false,
          callbackFn: () => Msg({
            type: 'DANGER',
            content: e.message
          })
        }),
        success: () => setLoading({
          show: false,
          callbackFn: () => {
            window.history.back();
            Msg({ type: 'INFO', content: 'MSG_SAVE_SUCCESS' });
          }
        })
      })
    }), [ Msg, setLoading, record, dispatch ])
  };
};

// TODO: Components
const EditForm: FC<{ data: IRecordData; isAppended: boolean; }> = ({ data, isAppended }) => {
  const intl = useIntl();
  const record = new RecordModel(data);
  const [ isXs, asXs ] = useState(window.innerWidth < 576);
  const { doStopSubmit, doCancel, doCreate, doUpdate } = useEvents({ isXs, asXs, record });

  return (
    <form onSubmit={ doStopSubmit }>
      <h4 className="page-title">
        <i className={ `mr-2 fa fa-${ isAppended ? 'plus' : 'pencil' }` } />
        <Fmsg tagName="strong" id={ isAppended ? 'APPEND_RECORD' : 'UPDATE_RECORD' } />
      </h4>

      <BsContainer>
        <BsRow align="center">
          <BsCol className="form-group" width={{ md: 8 }}>
            <Fmsg tagName="label" id="RECORD_DESC" />

            <input type="text" className="form-control" value={ record.desc } onChange={
              ({ target }) => record.desc = target.value
            } />
          </BsCol>
        </BsRow>

        <BsRow align="center">
          <BsCol className="form-group" width={{ def: 6, md: 4 }}>
            <Fmsg tagName="label" id="RECORD_TYPE" />
            <TypeDropdown value={ record.type } onChange={ value => record.type = value } />
          </BsCol>
          
          <BsCol className="form-group" width={{ def: 6, md: 4 }}>
            <Fmsg tagName="label" id="RECORD_STATUS" />

            <select className="form-control" value={ record.status } onChange={({ target }) => {
              record.status    = target.value;
              record.mapTurnOn = isAppended && 'expected' === target.value ? false : record.mapTurnOn;
            }}>
              <option value="actual">{ intl.messages.ACTUAL }</option>
              <option value="expected">{ intl.messages.EXPECTED }</option>
            </select>
          </BsCol>
        </BsRow>
          
        <BsRow align="center">
          <BsCol className="form-group" width={{ def: 6, md: 4 }}>
            <Fmsg tagName="label" id="AMOUNT_CYCLE" />

            <select className="form-control" value={ record.cycle } onChange={
              ({ target }) => record.cycle = target.value
            }>
              <option value="once">{ intl.messages.CYCLE_ONCE }</option>
              <option value="day">{ intl.messages.CYCLE_DAY }</option>
              <option value="month">{ intl.messages.CYCLE_MONTH }</option>
              <option value="year">{ intl.messages.CYCLE_YEAR }</option>
            </select>
          </BsCol>

          <BsCol className="form-group" width={{ def: 6, md: 4 }}>
            {/* { 'once' !== record.cycle ? null : [
              <Fmsg key="label" tagName="label" id="VALID_YM" />,

              <DatePicker key="dpicker" showMonthYearPicker withPortal={ isXs } className="form-control" dateFormat="yyyy/MM"
                selected={ record.vdateFm } onChange={(val) => record.vdateFm = val} />
            ] } */}
          </BsCol>
        </BsRow>
          
        <BsRow align="center">
          <BsCol className="form-group" width={{ md: 8 }}>
            <Fmsg tagName="label" id="AMOUNT" />

            <input type="number" className="form-control text-right" value={ record.amount } onChange={
              ({ target }) => record.amountStr = target.value
            } />
          </BsCol>
        </BsRow>

        <BsRow margin={{ t: 5 }}>
          <BsCol className="text-right">
            <button type="button" className="btn btn-secondary mr-2" onClick={ doCancel }>
              <i className="fa fa-ban mr-2" />
              <Fmsg id="CANCEL" />
            </button>

            <button type="submit" className="btn btn-primary" onClick={ isAppended ? doCreate : doUpdate }>
              <i className={ `fa fa-${ isAppended ? 'plus' : 'download' } mr-2` } />
              <Fmsg id={ isAppended ? 'ADD' : 'SAVE' } />
            </button>
          </BsCol>
        </BsRow>
      </BsContainer>
    </form>
  );
};

const EditRecord: FC<{ match: match<{ uid: string; }>; }> = ({ match: { params: { uid = '' } }}) => {
  const { store: { target: { data } }, dispatch } = useRecord();

  useEffect(() => {
    if (uid) dispatch({ action: 'FIND', params: { uid }});
  }, [ uid, dispatch ]);

  return !data && uid ? null : (
    <EditForm isAppended={ !uid } data={ data || {} } />
  );
};

export default EditRecord;
