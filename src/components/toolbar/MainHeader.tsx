import React, { FC, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useI18n, LANG } from '../../services/i18n';

import Logo from '../../assets/imgs/cash-logo.svg';


// TODO: Events
const useEvents = () => {
  const { setLang } = useI18n();

  return {
    asEnglish: useCallback(() => setLang(LANG.EN), [ setLang ]),
    asChinese: useCallback(() => setLang(LANG.ZH), [ setLang ])
  };
};

// TODO: Components
const MainHeader: FC = () => {
  const dropdown = useRef(null);
  const { asEnglish, asChinese } = useEvents();

  return (
    <nav className="main-header navbar navbar-expand navbar-dark bg-dark text-secondary border-bottom border-white">
      <Link className="navbar-brand text-white" to="/">
        <img className="rounded-circle" src={ Logo } alt="Logo" />
      </Link>
      
      <div className="collapse navbar-collapse">
        <ul className="lang-dropdown navbar-nav ml-auto">
          <li ref={ dropdown } className="nav-item dropdown">
            <button type="button" className="btn btn-link nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-language mr-2" />
            </button>

            <div className="dropdown-menu dropdown-menu-right">
              <button type="button" className="dropdown-item" onClick={ asEnglish }>English</button>
              <button type="button" className="dropdown-item" onClick={ asChinese }>繁體中文</button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MainHeader;
