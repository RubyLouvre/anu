import { init } from '@rematch/core';
import count from './models';

const store = init({
    models: { count }
});

export default store;
