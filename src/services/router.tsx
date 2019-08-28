import React, { FC, useEffect, useCallback } from 'react';
import Loadable from 'react-loadable';
import { FormattedMessage as Fmsg } from 'react-intl';
import { RouteProps } from 'react-router-dom';

import { useLoading } from './loading';

import { BsContainer, BsRow, BsCol } from '../components/grid';
import App from '../components/App';

import error404 from '../assets/imgs/404.svg';


// TODO: Types
interface IRouter extends RouteProps {
  text?: string;
  icon?: string;
}

// TODO: 404 Page Not Found
const PageNotFound: FC = () => {
  const goBack = useCallback(() => window.history.back(), []);

  return (
    <BsContainer className="not-found-404">
      <BsRow align="center">
        <BsCol width={{ def: 12, sm: 6, md: 4 }}>
          <img className="img-fluid" src={error404} alt="404" />
        </BsCol>
      </BsRow>

      <BsRow align="center">
        <BsCol className="text-center">
          <button type="button" className="btn btn-lg btn-link" onClick={goBack}>
            <Fmsg id="BACK_TO_PREV_PAGE" />
          </button>
        </BsCol>
      </BsRow>
    </BsContainer>
  );
};

// TODO: Loading Mask
const LoadingMask: FC = () => {
  const { Loading } = useLoading();

  useEffect(() => {
    Loading({ show: true });

    return () => Loading({ show: false })
  }, [ Loading ]);
  return null;
};

// TODO: Router Options
const router: IRouter[] = [{
  path: `${process.env.PUBLIC_URL}/`,
  exact: true,
  component: App
}, {
  path: `${process.env.PUBLIC_URL}/append`,
  text: 'APPEND_RECORD',
  icon: 'fa fa-plus',
  component: Loadable({
    loader: () => import('../components/EditRecord'),
    loading: LoadingMask
  })
}, {
  path: `${process.env.PUBLIC_URL}/list`,
  text: 'RECORD_LIST',
  icon: 'fa fa-list',
  component: Loadable({
    loader: () => import('../components/RecordList'),
    loading: LoadingMask
  })
}, {
  path: `${process.env.PUBLIC_URL}/update/:uid`,
  text: 'UPDATE_RECORD',
  component: Loadable({
    loader: () => import('../components/EditRecord'),
    loading: LoadingMask
  })
}, {
  component: PageNotFound
}];

export default router;
