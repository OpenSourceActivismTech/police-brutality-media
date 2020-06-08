import { createGlobalStyle, css } from 'styled-components';
import { colors, fonts, breakpoints, typography } from '../../utils/variables';
import 'normalize.css/normalize.css';
import '@reach/skip-nav/styles.css';

const {
  black,
  blue,
  red,
  mediumGray,
} = colors;
const { fontPrimary, fontHeadline } = fonts;
const { mobile } = breakpoints;

export const primaryTypography = css`
  font-family: ${fontPrimary};
  font-size: ${typography.primary.fontSize}px;
  line-height: ${typography.primary.lineHeight};

  @media (max-width: ${mobile}) {
    font-size: ${typography.small.fontSize}px;
  }
`;

export const smallTypography = css`
  font-family: ${fontPrimary};
  font-size: ${typography.small.fontSize}px;
  line-height: ${typography.small.lineHeight};
`;

export const h1Styles = css`
  font-family: ${fontHeadline};
  font-size: ${typography.h1.fontSize}px;
  line-height: ${typography.h1.lineHeight};
  margin: 0 0 20px;

  @media (max-width: ${mobile}) {
    font-size: ${typography.h2.fontSize}px;
  }
`;

export const h2Styles = css`
  font-family: ${fontHeadline};
  font-size: ${typography.h2.fontSize}px;
  line-height: ${typography.h2.lineHeight};
  font-weight: 700;
  margin: 60px 0 20px;

  @media (max-width: ${mobile}) {
    font-size: ${typography.h3.fontSize}px;
  }
`;

export const h3Styles = css`
  font-family: ${fontHeadline};
  font-size: ${typography.h3.fontSize}px;
  line-height: ${typography.h3.lineHeight};
  margin: 60px 0 20px;
`;

export const blockInlineMobileStyles = css`
  display: block;

  @media (max-width: ${mobile}) {
    display: inline;

    &:before {
      content: " ";
    };    
  }
`;

const GlobalStyles = createGlobalStyle`

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body {
    ${primaryTypography}
    color: ${black};
  }

  h1 {
    ${h1Styles}
  }

  h2 {
    ${h2Styles}
  }

  h3 {
    ${h3Styles}
  }

  hr {
    margin: 30px 0;
    border: 0;
    height: 1px;
    background: ${mediumGray};
  }

  p {
    margin: 0 0 32px;
  }

  a {
    color: ${red};
    transition: .3s;

    &:hover,
    &:focus {
      color: ${blue};
    }
  }

  a[href] {
    word-wrap: break-word;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    display: none;
    margin: 0;
  }

  input[type=number] {
    appearance: textfield;
  }

  .columns {
    margin-top: 0;

    &:not(:last-child) {
      margin-bottom: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    > .column {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  /* stylelint-disable max-nesting-depth */
  .html-content {

    ol,
    ul {

      li {
        padding-left: 10px;
      }
    }
  }

  /* stylelint-enable */

  [data-reach-skip-link]:focus {
    z-index: 31;
  }

  .container {
    width: 90%;
    max-width: 1384px;
    padding: 0;
    margin: 0 auto;
  }

  .container.narrow {
    width: 90%;
    max-width: 800px;
    padding: 0;
    margin: 0 auto;
  }

  li {
    margin-bottom: 20px;
  }
`;

export default GlobalStyles;
