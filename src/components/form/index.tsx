import React, { FC, ReactNode } from 'react';
import { MessageFormatElement } from 'intl-messageformat-parser';

interface IInlineGroupProps {
  label: string | MessageFormatElement[];
  labelWidth?: number | string;
  className?: string;
  children?: ReactNode;
}

export const BsInlineGroup: FC<IInlineGroupProps> = ({ label, labelWidth = 'auto', className = '', children }) => {
  return (
    <div className={[ 'input-group', className ].join(' ')}>
      <div className="input-group-prepend">
        <div className="input-group-text justify-content-end" style={{ width: labelWidth }}>{ label }</div>
      </div>

      { children }
    </div>
  );
};
