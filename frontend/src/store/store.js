import {configureStore} from '@reduxjs/toolkit';
import AuthSliceReducer from './slice/Auth.slice.js';
import TaskSliceReducer from './slice/Task.slice.js';
import expenceSliceReducer from './slice/Expence.slice.js';
import adminSliceReducer from './slice/Admin.slice.js';
export const store = configureStore({
  reducer: {
    auth: AuthSliceReducer,
    task: TaskSliceReducer,
    expnc: expenceSliceReducer,
    admin: adminSliceReducer,
  },
});
