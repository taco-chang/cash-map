import React, { FC, ReactElement, CSSProperties, ReactNode, useCallback } from 'react';
import { useIntl } from 'react-intl';

import { ActivedTab, ITitleProps } from './type.tab';


// TODO: Types
interface ITabProps {
  children: ReactElement[];
  className?: string;
  activeAt: string;
  style?: CSSProperties;
  onActived?: (id: string) => void;
}


// TODO: Components
const BsTitle: FC<ITitleProps> = ({ id, text, icon = '', active = false, onActived = () => {} }) => {
  const intl = useIntl();
  const doActive = useCallback(() => onActived(text), [ text, onActived ]);

  return (
    <button type="button" id={ `${ id }-tab` } data-toggle="tab" aria-controls={ id } style={{}}
      className={ `nav-item nav-link ${ active ? 'active' : '' }` } onClick={ doActive }>

      { !icon ? null : <i className={ `mr-2 ${ icon }` } /> }
      { text in intl.messages ? intl.messages[ text ] : text }
    </button>
  );
};

export const TabContent: FC<{
  className?: string;
  title: string;
  icon?: string;
  children: ReactNode;
}> = () => null;

export const BsTab: FC<ITabProps> = ({ children, activeAt, style, className = '', onActived = () => {}}) => {
  const actived = new ActivedTab(activeAt, children);

  return (
    <div className={ `cm-tab ${ className }` } style={ style }>
      <div className="nav nav-tabs">
        { actived.titleOpts.map(({ id, icon, text, active }) =>
          <BsTitle key={ id } {...{ id, icon, text, active, onActived }} />
        )}
      </div>

      <div className="tab-content">
        { actived.contentOpts.map(({ id, className, active, children: contentEl }) => !active ? null : (
          <div key={ id } id={ id } aria-labelledby={ `${ id }-tab` } className={
            `tab-pane fade show active ${ className }`
          }>
            { contentEl }
          </div>
        ))}
      </div>
    </div>
  );
};
