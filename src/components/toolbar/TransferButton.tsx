import React, { FC, useMemo, useCallback } from 'react';
import { useRecord } from '../../services/store/record';

const TransferButton: FC<{ className?: string; }> = ({ className = '' }) => {
  const valid = useMemo(() => JSON.parse(localStorage.getItem('CM_RECORDS') || '[]').length > 0, []);
  const { dispatch } = useRecord();
  const doDuplicate = useCallback(() => dispatch({ action: 'DUPLICATE' }), [ dispatch ]);

  return !valid ? null : (
    <button type="button" className={ `btn btn-info ${ className }` } onClick={ doDuplicate }>
      <i className="fa fa-cloud-upload" />
    </button>
  );
};

export default TransferButton;
