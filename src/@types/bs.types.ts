
export type BsColor = 'primary' | 'secondary' | 'success' | 'danger'
| 'warning' | 'info' | 'light' | 'dark' | 'white';

export const getTextColor = (bgColor: BsColor): BsColor =>
  [ 'warning', 'light', 'white' ].indexOf(bgColor) >= 0 ? 'dark' : 'white';
