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

interface IStoreState { msg?: IMessageState; }

interface IContext {
  msg?: IMessageOptions;
  dispatch: Dispatch<IMessageOptions | BTN>;
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

const useEvents = (msg?: IMessageState) => {
  useEffect(() => {
    if (msg)
      $(`#${ msg.uid }`).modal('show');
    else
      $('div.modal-backdrop').remove();
  }, [ msg ]);

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
      msg: {
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
      if (state.msg) {
        clearTimeout(state.msg.timeout);

        if (state.msg.handler instanceof Function) state.msg.handler(
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
  dispatch: () => {},
  [ STORE_DISPATCH ]: () => {}
});

const MessageBox: FC<{ children?: ReactNode }> = ({ children }) => {
  const [{ msg }, storeDispatch ] = useReducer(messageStore, {});
  const $do = useReducer(setMessage, storeDispatch);
  const { onClickMask } = useEvents(msg);

  return (
    <Context.Provider value={{ msg, dispatch: $do[1], [ STORE_DISPATCH ]: storeDispatch }}>
      { children }

      { !msg ? null : (
        <div className="modal message-modal" id={ msg.uid } onClick={ onClickMask }>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className={ `alert alert-${ 'CONFIRM' === msg.type ? 'primary' : msg.type.toLowerCase() }` }>
                <div className="media">
                  { !msg.icon ? null : <i className={ `mr-3 ${msg.icon}` } /> }

                  <div className="media-body">
                    { !msg.title ? null : (
                      <h5 className="mt-0">
                        <Fmsg tagName="strong" id={ msg.title } />
                      </h5>
                    ) }

                    <Fmsg tagName="p" id={ msg.content } />

                    <div className="d-flex justify-content-end">
                      { msg.btns.map(btn => (
                        <button key={ `btn-${ btn.code }` } type="button" className={ `ml-1 btn btn-${
                          BTN.CANCEL === btn.code ? 'secondary' : 'CONFIRM' === msg.type ? 'primary' : msg.type.toLowerCase()
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
