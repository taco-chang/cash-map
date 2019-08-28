import React, {
  FC,
  Reducer,
  Dispatch,
  ReactNode,
  createContext,
  useState,
  useReducer,
  useMemo,
  useContext
} from 'react';

import { IntlProvider } from 'react-intl';


// TODO: Types
export enum LANG { DEFAULT, EN, ZH }

interface IMessages { [message: string]: string; }

interface IMsgOptions { locale: string; messages: IMessages; }

interface IImportJSON { default: IMessages; }

interface IContext { locale: string; setLang: Dispatch<LANG> }


// TODO: Variables & Reducer
const defintl = import('../assets/i18n/en.json').then(({ default: messages }: IImportJSON): IMsgOptions => ({
  locale: 'en',
  messages
}));

const useI18n = () => useContext(Context);

const reducer: Reducer<Promise<IMsgOptions>, LANG> = (state, action: LANG) => {
  switch (action) {
    case LANG.EN: return defintl.then(res => {
      localStorage.setItem('CASH_MAP_LANG', 'en');

      return res;
    });
    case LANG.ZH: return import('../assets/i18n/zh.json').then(({ default: messages }: IImportJSON): IMsgOptions => {
      localStorage.setItem('CASH_MAP_LANG', 'zh');

      return { locale: 'zh', messages };
    });
    default: return ((locale: string) => {
      locale = locale.substring(0, locale.indexOf('-') > 0 ? locale.indexOf('-') : undefined);

      return import(`../assets/i18n/${locale}.json`).then(({ default: messages }: IImportJSON): IMsgOptions => {
        localStorage.setItem('CASH_MAP_LANG', locale);

        return { locale, messages };
      }).catch(() => defintl);
    })(localStorage.getItem('CASH_MAP_LANG') || navigator.language.toLowerCase());
  }
};


// TODO: Components
const Context = createContext<IContext>({ locale: 'en', setLang: () => {} });

const I18n: FC<{ children: ReactNode; }> = ({ children }) => {
  const [{ locale, messages }, setMessages ] = useState<IMsgOptions>({ locale: 'en', messages: {} });
  const [ promise, setLang ] = useReducer(reducer, defintl);
  const hasMessages = Object.keys(messages).length > 0;

  promise.then(msg => JSON.stringify(msg) === JSON.stringify(messages) ? null : setMessages(msg));

  useMemo(() => hasMessages ? null : setLang(LANG.DEFAULT), [ hasMessages ]);

  return !hasMessages ? null : (
    <IntlProvider {...{ locale, messages }}>
      <Context.Provider value={{ locale, setLang }}>
        { children }
      </Context.Provider>
    </IntlProvider>
  );
}

export default I18n;

export {
  useI18n
}
