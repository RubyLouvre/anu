import React from 'react';
import DevTools from 'mobx-react-devtools';
import { curry } from 'ramda';

function wrapWithDevTools(useDevTools, App) {
  return (
    <React.Fragment>
      <App />
      {useDevTools ? <DevTools /> : null}
    </React.Fragment>
  );
}

export default curry(wrapWithDevTools);
