import React from 'react';
import { Provider } from 'mobx-react';
import { curry, always } from 'ramda';

function injectStore(AppStore, App) {
  return always(
    <Provider App={AppStore}>
      <App />
    </Provider>
  );
}

export default curry(injectStore);
