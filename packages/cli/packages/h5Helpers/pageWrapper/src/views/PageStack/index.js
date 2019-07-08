import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Page from '../Page';

export default observer(({ pages }) => (
  <Fragment>
    {pages.map(page => (page ? <Page key={page.url} page={page} /> : null))}
  </Fragment>
));
