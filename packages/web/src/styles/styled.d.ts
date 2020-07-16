import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;

    colors: {
      primary: string;
      secundary: string;

      background: string;
      boxBackground: string;

      title: string;
      text: string;
    };
  }
}
