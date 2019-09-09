import React, { FC } from 'react';

import { useSource } from '../services/store/source';

import { BsContainer, BsRow, BsCol } from './bs/BsGrid';
import { BsInlineGroup } from './bs/BsForm';

import line_icon from '../assets/imgs/line_icon.svg';


const CloudShare: FC = () => {
  const { sources } = useSource();

  return (
    <BsContainer>
      <BsRow align="center">
        <BsCol width={{ def: 12, sm: 10, lg: 6 }}>
          <BsInlineGroup>
            { sources.filter(({ desc }) => 'MY_RECORD' === desc).map(source =>
              <BsInlineGroup key="my-record">
                <span className="form-control text-truncate text-center">{ source.uid }</span>

                <a href={
                  `https://social-plugins.line.me/lineit/share?url=${ encodeURIComponent(
                    `https://tabacotaco.github.io/cash-map/#/cloud/${ source.uid }`
                  )}`
                }>
                  <img alt="icon" className="img-fluid" src={ line_icon } style={{ width: 38 }} />
                </a>
              </BsInlineGroup>
            )}
          </BsInlineGroup>
        </BsCol>
      </BsRow>
    </BsContainer>
  );
};

export default CloudShare;
