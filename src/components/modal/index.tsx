import React, {
  FC,
  ReactNode,
  Reducer,
  Dispatch,
  SetStateAction,
  MouseEvent,
  useCallback,
  useReducer,
  useEffect
} from 'react';

import { FormattedMessage as Fmsg } from 'react-intl';
import uuidv4 from 'uuid/v4';


// TODO: Types
export enum BTN { DISMISS, CALLBACK }

interface IModalAction { show: boolean; onShowBsModal?: () => void; }
interface IModalState { id: string; setShow: Dispatch<SetStateAction<boolean>>; }

interface IEventInput {
  id: string;
  isShow: boolean;
  closeByBtn: boolean;
  setModal: Dispatch<IModalAction>;
  onShowBsModal?: () => void;
  doCallback: (btn: BTN | symbol) => void | 'close';
}

interface IProps {
  className?: string;
  closeByBtn?: boolean;
  title?: string | { icon: string; text: string; };
  children: ReactNode;
  show: [ boolean, Dispatch<SetStateAction<boolean>> ],
  doCallback?: (btn: BTN | symbol) => void | 'close';
  onShowBsModal?: () => void;
  btns?: {
    text?: string;
    code: BTN | symbol;
    icon?: string;
    color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'white' | 'light' | 'secondary' | 'dark';
  }[];
}

// TODO: Events & Reducer
const useEvents = ({ id, isShow, setModal, closeByBtn, onShowBsModal, doCallback }: IEventInput) => {
  useEffect(() => {
    if (!$(`#${ id }`).is(':hidden') !== isShow)
      setModal({ show: isShow, onShowBsModal });
  }, [ id, isShow, setModal, onShowBsModal ]);

  return {
    onClickMask: useCallback((e: MouseEvent) => {
      const $el = $(e.target);

      if ((!closeByBtn && $el.parents('div.modal-content').length === 0)
      || $el.is('button.modal-btn') || $el.parents('button.modal-btn').length > 0) {
        setModal({ show: false });
        doCallback(BTN.DISMISS);
      }
    }, [ setModal, closeByBtn, doCallback ]),

    onClickFbar: useCallback((btn: BTN | symbol) => {
      if ('close' === doCallback(btn) || BTN.DISMISS === btn)
        setModal({ show: false });
    }, [ setModal, doCallback ])
  };
};

const modalReducer: Reducer<IModalState, IModalAction> = (state, { show, onShowBsModal }) => {
  const { id, setShow } = state;

  $(`#${ id }`).modal(show ? 'show' : 'hide');
  setShow(show);

  if (show && onShowBsModal instanceof Function)
    onShowBsModal();

  return state;
};

// TODO: Components
const BsModal: FC<IProps> = ({
  className = '',
  closeByBtn = false,
  title = '',
  btns = [],
  show: [ isShow, setShow ],
  children,
  onShowBsModal = () => {},
  doCallback = () => { return 'close'; }
}) => {
  const [{ id }, setModal ] = useReducer(modalReducer, { id: uuidv4(), setShow });
  const { onClickMask, onClickFbar } = useEvents({ id, isShow, setModal, closeByBtn, onShowBsModal, doCallback });

  return !isShow ? null : (
    <div className="modal" id={ id } onClick={ onClickMask } data-backdrop={ closeByBtn ? 'static' : true } data-keyboard={ !closeByBtn }>
      <div className="modal-dialog">
        <div className={ `modal-content ${ className } px-2` }>
          { !title ? null : (({ text, icon = '' }: { text: string; icon?: string; }) =>
            <div className="modal-header py-3">
              <h5 className="modal-title">
                { !icon ? null : (<i className={ `${ icon } mr-2` } />)}

                <Fmsg tagName="strong" id={ text } />
              </h5>

              <button type="button" className="close text-white modal-btn" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )('string' === typeof title ? { text: title } : title)}

          <div className="modal-body py-2">{ children }</div>

          { btns.length === 0 ? null : (
            <div className="modal-footer pt-2">
              { btns.map(({ text = '', icon = '', color = '', code }) => (
                <button type="button" key={ 'symbol' === typeof code ? code.description : code } onClick={
                  () => onClickFbar(code)
                } className={
                  `modal-btn btn btn-${ color ? color : BTN.DISMISS === code ? 'secondary' : 'primary' }`
                }>
                  { !icon ? null : <i className={ `${icon} mr-2` } /> }
                  { !text ? null : <Fmsg id={ text } /> }
                </button>
              )) }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BsModal;
