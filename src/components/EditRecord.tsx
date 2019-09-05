import React, { FC, Dispatch, SetStateAction, FormEvent, useState, useEffect, useCallback } from 'react';
// import DatePicker from 'react-datepicker';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';
import { match } from 'react-router-dom';

import { BTN, useMessage } from '../services/message';
import { useLoading } from '../services/loading';
import { RecordModel, IRecordData, useRecord } from '../services/store/record';
import { BsContainer, BsRow, BsCol } from './grid';

import CycleDropdown from './editor/CycleDropdown';
import TypeDropdown from './editor/TypeDropdown';
import RecordGroup, { RecordGroupToggle } from './editor/RecordGroup';

import 'react-datepicker/dist/react-datepicker.css';


// TODO: Types
interface IEventInput {
  isXs: boolean;
  asXs: Dispatch<SetStateAction<boolean>>;
  record: RecordModel;
}


// TODO: Events
const useEvents = ({ isXs, asXs, record }: IEventInput) => {
  const isSizeChanged = isXs === (window.innerWidth < 576);
  const [ initValue ] = useState(JSON.stringify(record.getJSON(false)));
  const { isLoading, Loading } = useLoading();
  const { dispatch } = useRecord();
  const { Message } = useMessage();

  const doCancel = useCallback(() => {
    record.reset();
    window.history.back();
  }, [ record ]);

  useEffect(() => {
    $(window).on('resize', () => asXs(window.innerWidth < 576));

    return () => { $(window).off('resize') };
  }, [ isSizeChanged, asXs ]);

  return {
    onEditGroup: useCallback((value: string) => record.group = value, [ record ]),

    doStopSubmit: useCallback((e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []),

    doCancel: useCallback(() => initValue === JSON.stringify(record.getJSON(false)) ? doCancel() : Message({
      type: 'CONFIRM',
      content: 'MSG_MODIFIED_CHECK',
      handler: btn => BTN.CONFIRM === btn ? doCancel() : null
    }), [ Message, initValue, record, doCancel ]),

    doCreate: useCallback(() => isLoading ? null : Loading({
      show: true,
      callbackFn: () => dispatch({
        action: 'CREATE',
        params: record.getJSON(),
        fail: (e: Error) => Loading({
          show: false,
          callbackFn: () => Message({ type: 'DANGER', content: e.message })
        }),
        success: () => Loading({
          show: false,
          callbackFn: () => {
            window.history.back();
            Message({ type: 'INFO', content: 'MSG_SAVE_SUCCESS' });
          }
        })
      })
    }), [ Message, Loading, isLoading, record, dispatch ]),

    doUpdate: useCallback(() => isLoading ? null : Loading({
      show: true,
      callbackFn: () => dispatch({
        action: 'UPDATE',
        params: record.getJSON(),
        fail: (e: Error) => Loading({
          show: false,
          callbackFn: () => Message({ type: 'DANGER', content: e.message })
        }),
        success: () => Loading({
          show: false,
          callbackFn: () => {
            window.history.back();
            Message({ type: 'INFO', content: 'MSG_SAVE_SUCCESS' });
          }
        })
      })
    }), [ Message, Loading, isLoading, record, dispatch ])
  };
};

// TODO: Components
const EditForm: FC<{ data: IRecordData; isAppended: boolean; }> = ({ data, isAppended }) => {
  const intl = useIntl();
  const record = new RecordModel(data);
  const showGroup = useState<boolean>(false);
  const [ isXs, asXs ] = useState(window.innerWidth < 576);
  const { isLoading } = useLoading();

  const {
    onEditGroup,
    doStopSubmit,
    doCancel,
    doCreate,
    doUpdate
  } = useEvents({ isXs, asXs, record });

  return (
    <div>
      <RecordGroup show={ showGroup } group={ record.group } onChange={ onEditGroup } />

      <form onSubmit={ doStopSubmit }>
        <h4 className="page-title">
          <i className={ `mr-2 fa fa-${ isAppended ? 'plus' : 'pencil' }` } />
          <Fmsg tagName="strong" id={ isAppended ? 'APPEND_RECORD' : 'UPDATE_RECORD' } />
        </h4>

        <BsContainer>
          <BsRow align="center">
            <BsCol className="form-group" width={{ md: 8 }}>
              <label>
                { intl.messages.RECORD_DESC }

                <RecordGroupToggle show={ showGroup } className="btn btn-link text-warning" />
              </label>

              <input type="text" className="form-control" value={ record.desc } onChange={
                ({ target }) => record.desc = target.value
              } />
            </BsCol>
          </BsRow>

          <BsRow align="center">
            <BsCol className="form-group" width={{ def: 6, md: 4 }}>
              <Fmsg tagName="label" id="AMOUNT_CYCLE" />

              <CycleDropdown value={ record.cycle } disableOnce={ 'deposit' === record.type } onChange={
                value => record.cycle = value
              } />
            </BsCol>

            <BsCol className="form-group" width={{ def: 6, md: 4 }}>
              <Fmsg tagName="label" id="RECORD_TYPE" />

              <TypeDropdown value={ record.type } disableDeposit={ 'once' === record.cycle } onChange={
                value => record.type = value
              } />
            </BsCol>
          </BsRow>
            
          {/* <BsRow align="center">
            <BsCol className="form-group" width={{ def: 6, md: 4 }}>
              { 'once' !== record.cycle ? null : [
                <Fmsg key="label" tagName="label" id="VALID_YM" />,

                <DatePicker key="dpicker" showMonthYearPicker withPortal={ isXs } className="form-control" dateFormat="yyyy/MM"
                  selected={ record.vdateFm } onChange={(val) => record.vdateFm = val} />
              ] }
            </BsCol>
          </BsRow> */}
            
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

              <button type="submit" className="btn btn-primary" disabled={ isLoading } onClick={ isAppended ? doCreate : doUpdate }>
                <i className={ `fa fa-${ isAppended ? 'plus' : 'download' } mr-2` } />
                <Fmsg id={ isAppended ? 'ADD' : 'SAVE' } />
              </button>
            </BsCol>
          </BsRow>
        </BsContainer>
      </form>
    </div>
  );
};

const EditRecord: FC<{ match: match<{ uid: string; }>; }> = ({ match: { params: { uid = '' } }}) => {
  const { data, dispatch } = useRecord();

  useEffect(() => {
    if (uid) dispatch({
      action: 'FIND',
      params: { uid }
    });
  }, [ uid, dispatch ]);

  return !data && uid ? null : (
    <EditForm isAppended={ !uid } data={ data || {} } />
  );
};

export default EditRecord;
