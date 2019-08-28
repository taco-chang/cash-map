import { FC, createElement } from 'react';

import IBsgridProps, {
  IRowProps,
  IColProps,
  toClassString,
  getBsClasses,
  getColClass,
  getBootstrapClass
} from './grid.types';


// TODO: Components
export const BsContainer: FC<IBsgridProps> = (props: IBsgridProps) => {
  const { tagName = 'div', children } = props;

  return createElement(tagName, {
    className: toClassString([ 'container', ...getBsClasses('block', props) ])
  }, children);
};

export const BsRow: FC<IRowProps> = (props: IRowProps) => {
  const { tagName = 'div', children, gutters = true, alignable = '', align = false } = props;

  return createElement(tagName, {
    className: toClassString([
      'row',
      gutters ? '' : 'no-gutters',
      align === false ? '' : `justify-content-${getBootstrapClass(alignable, { end: align })}`,
      ...getBsClasses('flex', props)
    ])
  }, children);
};

export const BsCol: FC<IColProps> = (props: IColProps) => {
  const { tagName = 'div', children } = props;

  return createElement(tagName, {
    className: toClassString([
      'col',
      ...getColClass(props),
      ...getBsClasses('block', props)
    ])
  }, children);
}
