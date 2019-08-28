import { ReactNode } from 'react';


// TODO: Basic Types
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

type BsSize = '' | Breakpoint;
type BsBreakpoint = 'def' | Breakpoint;
type BsSpacing5 = 1 | 2 | 3 | 4 | 5;

type BsColor = 'primary' | 'secondary' | 'success' | 'danger'
  | 'warning' | 'info' | 'light' | 'dark' | 'white';

type BsDisplay = 'inline' | 'inline-block' | 'inline-flex'
  | 'block' | 'flex' | 'table' | 'table-row' | 'table-cell';


// TODO: Configures Types
enum COLUMN { WIDTH, OFFSET, ORDER }

type BsCol12 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Width = 'auto' | BsCol12;
type Order = 'first' | 'last' | BsCol12;

type BsColors = false | { border?: BsColor; text?: BsColor; bg?: BsColor; };
type BsHidden = false | BsBreakpoint | BsBreakpoint[];
type BsBorder = boolean | { t?: true;  l?: true; b?: true;  r?: true; };
type BsRounded = boolean | { size?: 'sm' | 'lg'; type?: 'top' | 'bottom' | 'left' | 'right' | 'circle' | 'pill'; };

type BsMargin = false | BsSpacing5 | {
  t?: BsSpacing5;  l?: BsSpacing5 | 'auto';
  b?: BsSpacing5;  r?: BsSpacing5 | 'auto';
  y?: BsSpacing5;  x?: BsSpacing5 | 'auto';
};

type BsPadding = false | BsSpacing5 | {
  t?: BsSpacing5;  l?: BsSpacing5;
  b?: BsSpacing5;  r?: BsSpacing5;
  y?: BsSpacing5;  x?: BsSpacing5;
};

interface IBreakpoint<T> { def?: T; sm?: false | T; md?: false | T; lg?: false | T; xl?: false | T; }

export interface IRowProps extends IBsgridProps {
  align?: false | 'start' | 'center' | 'end' | 'around' | 'between';
  alignable?: BsSize;
  gutters?: boolean;
}

export interface IColProps extends IBsgridProps {
  width?: Width | IBreakpoint<Width>;
  offset?: false | BsCol12 | IBreakpoint<BsCol12>;
  order?: false | Order | IBreakpoint<Order>;
}


// TODO: Generate Class Function
function getColumnOptions<T>(options: T | false, fn: (bssize: BsSize, opts: T) => void): void {
  const opts: IBreakpoint<T> = (options instanceof Object ? options : { def: options }) as IBreakpoint<T>;

  Object.keys(opts).forEach((size: string) => (opts as any)[size] === false ? null : fn(
    ('def' === size ? '' : size) as BsSize,
    (opts as any)[size]
  ));
}

function getSpacingClass(kind: 'm' | 'p', options: any): string[] {
  const cls: string[] = [];

  Object.keys(options).forEach((size: string) => {
    const bssize = 'def' === size ? '' : size;
    const value = options[size];

    if (value !== false) {
      if ('number' === typeof value)
        cls.push(getBootstrapClass(bssize as BsSize, { start: kind, end: value }));
      else Object.keys(value).forEach((on: string) => {
        const $value = value[on] || '';

        if ($value)
          cls.push(getBootstrapClass(bssize as BsSize, { start: `${kind}${on}`, end: $value }));
      });
    }
  });
  return cls;
}

function getBorderClass(options: BsBorder): string[] {
  const cls: string[] = [];

  if (options !== false) {
    if (options === true)
      cls.push('border');
    else Object.keys(options).forEach((on: string) => {
      switch (on) {
        case 't': cls.push('border-top'); break;
        case 'b': cls.push('border-bottom'); break;
        case 'l': cls.push('border-left'); break;
        case 'r': cls.push('border-right'); break;
      }
    });
  }
  return cls;
}

function getRoundedClass(options: BsRounded): string[] {
  const cls: string[] = [];

  if (options !== false) {
    if (options === true)
      cls.push('rounded');
    else Object.keys(options).forEach((prop: string) => {
      const { [prop]: value } = options as any;

      if (value)
        cls.push(`rounded-${value}`);
    });
  }
  return cls;
}

function getColorClass(options: BsColors): string[] {
  const cls: string[] = [];

  if (options !== false) Object.keys(options).forEach((target: string) => {
    const { [target]: value } = options as any;

    if (value)
      cls.push('border' === target ? `border-${value}` : `${target}-${value}`);
  });
  return cls;
}

function getDisplayClass(display: BsDisplay, options: BsHidden): string[] {
  const cls: string[] = [`d-${display}`];

  if (options !== false) {
    const hiddenOn: BsBreakpoint[] = Array.isArray(options) ? options : [options];

    ['def', 'sm', 'md', 'lg', 'xl'].filter((breakpoint: string) =>
      hiddenOn.indexOf(breakpoint as BsBreakpoint) >= 0
    ).forEach((breakpoint: string) => {
      const size: BsSize = 'def' === breakpoint ? '' : (breakpoint as BsSize);

      cls.splice(cls.indexOf(getBootstrapClass(size, { start: 'd', end: display })), 1);
      cls.push(getBootstrapClass(size, { start: 'd', end: 'none' }));
    });
  }
  return cls;
}

export function getBootstrapClass(
  size: BsSize,
  { start = '', end = '' }: { start?: string | number, end?: string | number } = {}
): string {
  return [start, size, end].filter((value: string | number) => !(!value)).join('-');
};

export function toClassString(cls: string[]): string {
  return cls.filter((value: string, i: number, arr: string[]) =>
    !(!value) && arr.indexOf(value) === i
  ).join(' ');
}

export function getColClass({ width = 'auto', offset = false, order = false }: IColProps): string[] {
  return [ width, offset, order ].reduce((cls: string[], option: any, i: number): string[] => {
    switch (i) {
      case COLUMN.WIDTH: getColumnOptions<Width>(option, (size, opts) =>
        cls.push(getBootstrapClass(size, { start: 'col', end: 'auto' === opts ? '' : opts }))
      ); break;
      case COLUMN.OFFSET: getColumnOptions<BsCol12>(option, (size, opts) =>
        cls.push(getBootstrapClass(size, { start: 'offset', end: opts }))
      ); break;
      case COLUMN.ORDER: getColumnOptions<Order>(option, (size, opts) =>
      cls.push(getBootstrapClass(size, { start: 'order', end: opts }))
    ); break;
    }
    return [ ...cls ];
  }, []);
}

export function getBsClasses(display: BsDisplay, {
  className = '',
  margin = false,
  padding = false,
  border = false,
  rounded = false,
  colors = false,
  hidden = false
}: IBsgridProps): string[] {
  const isMgSpacing = Object.keys(margin).filter(prop => [ 'def', 'sm', 'md', 'lg', 'xl' ].indexOf(prop) >= 0).length > 0;
  const isPdSpacing = Object.keys(padding).filter(prop => [ 'def', 'sm', 'md', 'lg', 'xl' ].indexOf(prop) >= 0).length > 0;

  return [
    className,
    ...getSpacingClass('m', !isMgSpacing ? { def: margin } : margin),
    ...getSpacingClass('p', !isPdSpacing ? { def: padding } : padding),
    ...getBorderClass(border),
    ...getRoundedClass(rounded),
    ...getColorClass(colors),
    ...getDisplayClass(display, hidden)
  ];
};

export default interface IBsgridProps {
  tagName?: string;
  className?: string;

  margin?: BsMargin | IBreakpoint<BsMargin>;
  padding?: BsPadding | IBreakpoint<BsPadding>;
  border?: BsBorder;
  rounded?: BsRounded;
  colors?: BsColors;
  hidden?: BsHidden;

  children?: ReactNode;
}