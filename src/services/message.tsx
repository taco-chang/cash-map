import React, {
  FC,
  Dispatch,
  Reducer,
  ReactNode,
  MouseEvent,
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback
} from 'react';

import { FormattedMessage as Fmsg } from 'react-intl';
import uuidv4 from 'uuid/v4';

// TODO: Types
const STORE_DISPATCH = Symbol('DISPATCH');

export enum BTN { CONFIRM, CANCEL }

interface IStoreState { options?: IMessageState; }

interface IContext {
  options?: IMessageOptions;
  Message: Dispatch<IMessageOptions | BTN>;
  [ STORE_DISPATCH ]: Dispatch<IMessageOptions | BTN>;
}

interface IMessageOptions {
  type: 'INFO' | 'WARNING' | 'DANGER' | 'CONFIRM';
  uid?: string;
  title?: string;
  icon?: string;
  content: string;
  timeout?: number;
  handler?: (btn: BTN) => any;
}

interface IMessageState extends IMessageOptions {
  btns: ({
    text: string;
    code: BTN;
    icon?: string;
  })[];
}

// TODO: Hooks
const useMessage = () => useContext(Context);

const useEvents = (options?: IMessageState) => {
  useEffect(() => {
    if (options)
      $(`#${ options.uid }`).modal('show');
    else
      $('div.modal-backdrop').remove();
  }, [ options ]);

  return {
    onClickMask: useCallback((e: MouseEvent) => {
      if ($(e.target).parents('div.alert').length > 0) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, [])
  };
};

// TODO: Reducer
const messageStore: Reducer<IStoreState, IMessageOptions | BTN> = (state, options) => {
  switch (typeof options) {
    case 'object': return {
      options: {
        ...options,
        btns: 'CONFIRM' !== options.type ? [
          { text: 'CHECK_IT', code: BTN.CONFIRM, icon: 'fa fa-check' }
        ] : [
          { text: 'CANCEL', code: BTN.CANCEL, icon: 'fa fa-ban' },
          { text: 'CONFIRM', code: BTN.CONFIRM, icon: 'fa fa-check' }
        ]
      }
    };
    case 'number':
      if (state.options) {
        clearTimeout(state.options.timeout);

        if (state.options.handler instanceof Function) state.options.handler(
          options
        );
      }
      return {};
  }
  return state;
};

const setMessage: Reducer<Dispatch<IMessageOptions | BTN>, IMessageOptions | BTN> = (dispatch, options) => {
  switch (typeof options) {
    case 'number':
      dispatch(options);
      break;

    case 'object':
      const { type, timeout = null } = options;

      dispatch({
        ...options,
        uid     : uuidv4(),
        timeout : 'CONFIRM' === type ? undefined : window.setTimeout(
          () => dispatch(BTN.CANCEL),
          !timeout ? 2000 : timeout
        )
      });
      break;
  }
  return dispatch;
};

// TODO: Components
const Context = createContext<IContext>({
  Message: () => {},
  [ STORE_DISPATCH ]: () => {}
});

const MessageBox: FC<{ children?: ReactNode }> = ({ children }) => {
  const [{ options }, storeDispatch ] = useReducer(messageStore, {});
  const $do = useReducer(setMessage, storeDispatch);
  const { onClickMask } = useEvents(options);

  return (
    <Context.Provider value={{ options, Message: $do[1], [ STORE_DISPATCH ]: storeDispatch }}>
      { children }

      { !options ? null : (
        <div className="modal message-modal" id={ options.uid } onClick={ onClickMask }>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className={ `alert alert-${ 'CONFIRM' === options.type ? 'primary' : options.type.toLowerCase() }` }>
                <div className="media">
                  { !options.icon ? null : <i className={ `mr-3 ${options.icon}` } /> }

                  <div className="media-body">
                    { !options.title ? null : (
                      <h5 className="mt-0">
                        <Fmsg tagName="strong" id={ options.title } />
                      </h5>
                    ) }

                    <Fmsg tagName="p" id={ options.content } />

                    <div className="d-flex justify-content-end">
                      { options.btns.map(btn => (
                        <button key={ `btn-${ btn.code }` } type="button" className={ `ml-1 btn btn-${
                          BTN.CANCEL === btn.code ? 'secondary'
                            : 'CONFIRM' === options.type ? 'primary'
                              : options.type.toLowerCase()
                        }`} onClick={ () => $do[1](btn.code) }>
                          { !btn.icon ? null : <i className={ `mr-2 ${btn.icon}` } /> }
                          <Fmsg id={ btn.text } />
                        </button>
                      )) }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Context.Provider>
  );
};

export default MessageBox;
export { useMessage };
