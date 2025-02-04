declare module 'react-csv' {
  import * as React from 'react';

  export interface CSVLinkProps {
    data: any;
    headers?: any;
    separator?: string;
    filename?: string;
    target?: string;
    asyncOnClick?: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class CSVLink extends React.Component<CSVLinkProps> {}
  export default CSVLink;
}
