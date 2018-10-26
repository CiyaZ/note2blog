# hello, world!

This is note 1-1-1

sample code of your note：
```javascript
import { queryAreas } from '@/services/customer';
import formatAreaData from '@/utils/AreaUtil';

export default {
  namespace: 'appReducer',
  state: {
    data: {},
    antdData: [{
      value: '加载中',
      label: '加载中',
    },
    ],
    status: '',
  },
  effects: {
    *fetchAreaData(action, {call, put}) {
      const response = yield call(queryAreas);
      yield put({
        type: 'saveAreaData',
        payload: response
      });
    }
  },
  reducers: {
    loadingAreaData(state, action) {
      return {
        ...state,
        status: 'loading'
      }
    },
    saveAreaData(state, action) {
      return {
        ...state,
        data: action.payload,
        antdData: formatAreaData(action.payload),
        status: 'load success'
      };
    }
  }
};
```

![](res/icon_qb.jpg)