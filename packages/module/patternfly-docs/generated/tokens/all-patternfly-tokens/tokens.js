import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
import { TokensTable } from '../../../content/./tokensTable.js';
import { TokensTable2 } from '../../../content/./tokensTable2.js';
const pageData = {
  "id": "All PatternFly tokens",
  "section": "tokens",
  "subsection": "",
  "deprecated": false,
  "beta": false,
  "demo": false,
  "newImplementationLink": false,
  "source": "tokens",
  "tabName": null,
  "slug": "/tokens/all-patternfly-tokens/tokens",
  "sourceLink": "https://github.com/patternfly/patternfly-org/blob/main/packages/module/patternfly-docs/content/all-patternfly-tokens.md",
  "relPath": "packages/module/patternfly-docs/content/all-patternfly-tokens.md"
};
pageData.liveContext = {
  TokensTable,
  TokensTable2
};
pageData.relativeImports = "import { TokensTable } from 'content/./tokensTable.js';,import { TokensTable2 } from 'content/./tokensTable2.js';"
pageData.examples = {
  
};

const Component = () => (
  <React.Fragment>
    <TokensTable2/>
  </React.Fragment>
);
Component.displayName = 'TokensAllPatternflyTokensTokensDocs';
Component.pageData = pageData;

export default Component;
