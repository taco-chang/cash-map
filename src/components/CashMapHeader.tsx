import React, { FC, useRef, useState, useEffect, useCallback } from 'react';

import { Link } from 'react-router-dom';
// import { FormattedMessage as Fmsg } from 'react-intl';

import { useI18n, LANG } from '../services/i18n';
// import routers from '../services/router';
import Logo from '../assets/imgs/cash-logo.svg';


// TODO: Main Logo
const CenterLogo: FC = () => {
  return (
    <Link className="navbar-brand text-white" to="/">
      <img className="rounded-circle" src={ Logo } alt="Logo" />
    </Link>
  );
};

// TODO: Language Dropdown List
const LangDropdown: FC<{ onExpanded?: () => void }> = ({ onExpanded = () => {}}) => {
  const dropdown = useRef(null);
  const { setLang } = useI18n();

  const asEn = useCallback(() => setLang(LANG.EN), [ setLang ]);
  const asZh = useCallback(() => setLang(LANG.ZH), [ setLang ]);

  useEffect(() => {
    const { current: el } = dropdown;

    $(el as any).on('show.bs.dropdown', () => onExpanded());

    return () => { $(el as any).off('shown.bs.dropdown') };
  });

  return (
    <ul className="lang-dropdown navbar-nav ml-auto">
      <li ref={ dropdown } className="nav-item dropdown">
        <button type="button" className="btn btn-link nav-link dropdown-toggle" data-toggle="dropdown">
          <i className="fa fa-language mr-2" />
        </button>

        <div className="dropdown-menu dropdown-menu-right">
          <button type="button" className="dropdown-item" onClick={ asEn }>English</button>
          <button type="button" className="dropdown-item" onClick={ asZh }>繁體中文</button>
        </div>
      </li>
    </ul>
  );
};

// TODO: Router Menu
// const LeftSideMenu: FC<{ show: boolean; setShow: (show: boolean) => void; }> = ({ show = false, setShow }) => {
//   const $path = window.location.pathname;
//   const asClose = useCallback(() => setShow(false), [ setShow ]);

//   useEffect(() => {
//     $(document.body).on('click', ({ target }) =>
//       ($(target).parents('.menu-bars').length > 0) ? null : asClose()
//     );
//     return () => {$(document.body).off('click')};
//   });

//   return (
//     <nav className={[ 'left-side-menu nav flex-column rounded-right', show ? 'show' : '' ].join(' ')}>
//       { routers.filter(({ path, exact }) => exact !== true && path && path.indexOf(':') < 0).map(({ path = '/', text = '', icon = '' }) => (
//         <Link key={ path as string } to={ path as string } onClick={ asClose } className={[
//           'nav-link',
//           path === $path ? 'active' : ''
//         ].join(' ')}>
//           <i className={ `mr-2 ${ icon }` } />
//           <Fmsg id={ text } />
//         </Link>
//       )) }
//     </nav>
//   );
// };

// TODO: Main Header Bar
const CashMapHeader: FC = () => {
  return (
    <nav className="cash-map-header navbar navbar-expand navbar-dark bg-dark text-secondary border-bottom border-white">
      {/* <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto menu-bars">
          <li className="nav-item">
            <button type="button" className="btn btn-link nav-link" onClick={ asShow }>
              <i className="fa fa-bars" />
            </button>

            <LeftSideMenu show={ showMenu } setShow={ setShowMenu } />
          </li>
        </ul>
      </div> */}

      <CenterLogo />

      <div className="collapse navbar-collapse">
        <LangDropdown />
      </div>
    </nav>
  );
};

export default CashMapHeader;
