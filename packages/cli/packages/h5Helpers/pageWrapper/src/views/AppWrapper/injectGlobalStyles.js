import React from 'react';
import { always } from 'ramda';

export default Comp =>
  always(
    <React.Fragment>
      <style jsx global>{`
        * {
          padding: 0;
          margin: 0;
          outline: none;
        }
        #app {
          width: 100%;
          height: 100%;
          overflow-y: scroll;
        }
      `}</style>
      <Comp />
    </React.Fragment>
  );
