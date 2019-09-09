import { ReactNode, ReactElement, useState } from 'react';
import uuidv4 from 'uuid/v4';


interface ITabRegister { [ id: string ]: ReactElement; }

export interface ITitleProps {
  id: string;
  text: string;
  icon?: string;
  active: boolean;
  onActived?: (id: string) => void;
}

interface IContentProps {
  id: string;
  className?: string;
  children: ReactNode;
  active: boolean;
}

export class ActivedTab {
  private tabs: ITabRegister = {};

  constructor(private activeAt: string, el: ReactElement[]) {
    this.tabs = el.reduce((res: ITabRegister, el) => {
      const [ id ] = useState(uuidv4());

      return { ...res, [ id ]: el };
    }, {});
  }

  get titleOpts(): ITitleProps[] {
    return Object.keys(this.tabs).map((id): ITitleProps => {
      const { title, icon } = this.tabs[id].props;

      return { id, icon, text: title, active: this.activeAt === title };
    });
  }

  get contentOpts(): IContentProps[] {
    return Object.keys(this.tabs).map((id): IContentProps => {
      const { title, className, children } = this.tabs[id].props;

      return { id, className, children, active: this.activeAt === title };
    });
  }
}
