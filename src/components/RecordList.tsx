import React, { FC, Dispatch, useState, useEffect, useCallback, SetStateAction } from 'react';
import { FormattedMessage as Fmsg, useIntl } from 'react-intl';

import { IRequestAction, useRecord } from '../services/store/record';

import { BsContainer, BsRow, BsCol } from './grid';
import { BsInlineGroup } from './form';

import TypeDropdown from './editor/TypeDropdown';
import AmountCard from './AmountCard';


// TODO: Types
interface IEventInput {
  dispatch: Dispatch<IRequestAction>;
  setFilter: Dispatch<SetStateAction<string>>;
}

const useEvents = ({ dispatch, setFilter }: IEventInput) => {
  useEffect(() => dispatch({ action: 'LIST' }), [ dispatch ]);

  return {
    onFilterChange: useCallback((value: string) => {
      setFilter(value);
      dispatch({ action: 'LIST', params: { type: 'all' === value ? '' : value }})
    }, [ dispatch, setFilter ])
  };
}

const RecordList: FC = () => {
  const intl = useIntl();
  const [ filter, setFilter ] = useState('all');
  const { store: { target: { list } }, dispatch } = useRecord();
  const { onFilterChange } = useEvents({ setFilter, dispatch });
  const doClear = useCallback(() => dispatch({ action: 'CLEAR' }), [ dispatch ]);

  return (
    <div>
      <h4 className="page-title">
        <i className="mr-2 fa fa-list" />
        <Fmsg tagName="strong" id="RECORD_LIST" />
      </h4>

      <BsContainer>
        <BsRow border={{ b: true }}>
          <BsCol className="form-group">
            <Fmsg tagName="label" id="RECORD_TYPE" />

            <BsInlineGroup>
              <TypeDropdown className="rounded" value={ filter } onChange={ onFilterChange }>
                <option value="all">{ intl.messages.ALL_OPTION }</option>
              </TypeDropdown>

              <button type="button" className="btn btn-danger ml-2" onClick={ doClear }>
                <i className="fa fa-plus mr-2" />
                <Fmsg id="CLEAR" />
              </button>
            </BsInlineGroup>
          </BsCol>
        </BsRow>

        <BsRow margin={{ b: 3 }}>
          { list.map(data => (
            <BsCol key={ `record-${ data.uid }` } width={{ def: 12, md: 6, lg: 4 }}>
              <AmountCard record={ data } />
            </BsCol>
          )) }

          { list.length > 0 ? null : (
            <BsCol className="text-center mt-3 text-secondary">
              <Fmsg tagName="h4" id="DATA_NOT_FOUND" />
            </BsCol>
          )}
        </BsRow>
      </BsContainer>
    </div>
  );
};

export default RecordList;
