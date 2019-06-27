/* eslint no-console: 0*/
import * as R from 'ramda';

const MIN_TAB_LIST_COUNT = 2;
const MAX_TAB_LIST_COUNT = 5;

const lengthGteMinimum = R.compose(
  R.gte(R.__, MIN_TAB_LIST_COUNT),
  R.length
);
const lengthLteMaximum = R.compose(
  R.lte(R.__, MAX_TAB_LIST_COUNT),
  R.length
);
const hasPagePath = R.compose(
  R.not,
  R.isNil,
  R.prop('pagePath')
);
const hasText = R.compose(
  R.not,
  R.isNil,
  R.prop('text')
);
const validListItem = R.allPass([hasPagePath, hasText]);
const validList = R.all(validListItem);
const validTabList = R.allPass([lengthGteMinimum, lengthLteMaximum, validList]);

export default function(list) {
  if (validTabList(list)) return list;
  console.log('tabList: ', list);
  throw new Error(
    '`tabList` should have at least 2 items and no more than 5 items and ' +
      'no more than 5 items, every item should have at least ' +
      'properties `pagePath` and `text`. See above for more information.'
  );
}
