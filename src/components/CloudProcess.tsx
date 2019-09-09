import React, { FC, useState } from 'react';
import { FormattedMessage as Fmsg } from 'react-intl';
import { match } from 'react-router-dom';

import { BsTab, TabContent } from './bs/BsTab';
import CloudSync from './CloudSync';
import CloudShare from './CloudShare';


const CloudProcess: FC<{ match: match<{ syncKey?: string; }>; }> = ({ match: { params: { syncKey = '' }}}) => {
  const [ active, setActive ] = useState('RECORD_SYNC');

  return (
    <div>
      <h4 className="page-title">
        <i className="mr-2 fa fa-cloud" />
        <Fmsg tagName="strong" id="CLOUD_PROCESS" />
      </h4>

      <BsTab activeAt={ active } onActived={ title => setActive(title) }>
        <TabContent icon="fa fa-cloud-download" title="RECORD_SYNC">
          <CloudSync syncKey={ syncKey } />
        </TabContent>

        <TabContent icon="fa fa-share-square" title="RECORD_SHARE">
          <CloudShare />
        </TabContent>
      </BsTab>
    </div>
  );
};

export default CloudProcess;
