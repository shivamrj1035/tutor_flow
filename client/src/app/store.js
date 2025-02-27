import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "../features/apis/authApi.js";
import internal from "node:stream";
import { courseApi } from "@/features/apis/courseApi.js";
import { purchaseApi } from "@/features/apis/purchaseApi.js";
import { courseProgressApi } from "@/features/apis/courseProgressApi.js";

export const appStore = configureStore({
    reducer : rootReducer,
    middleware : (DM) => DM().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
})

const initializeApp = async () => {
    return appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch: true}))
}

initializeApp();