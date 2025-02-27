import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import { authApi } from '../features/apis/authApi.js';
import { courseApi } from '@/features/apis/courseApi.js';
import { purchaseApi } from '@/features/apis/purchaseApi.js';
import { courseProgressApi } from '@/features/apis/courseProgressApi.js';

const rootReducer = combineReducers({
    [authApi.reducerPath] : authApi.reducer,
    [courseApi.reducerPath] : courseApi.reducer,
    [purchaseApi.reducerPath] : purchaseApi.reducer,
    [courseProgressApi.reducerPath] : courseProgressApi.reducer,
    auth : authReducer
})

export default rootReducer;