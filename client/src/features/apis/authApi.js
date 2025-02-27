import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {userLoggedIn, userLoggedOut} from '../authSlice';

const USER_API = import.meta.env.VITE_BACKEND_URL+"user/"

export const authApi = createApi({
    reducerPath : "authApi",
    baseQuery : fetchBaseQuery({
        baseUrl : USER_API,
        credentials : 'include'
    }),
    endpoints : (builder) =>({
        registerUser : builder.mutation({
            query : (inputdata) => ({
                url : 'register',
                method : 'POST',
                body : inputdata
            })
        }),
        loginUser : builder.mutation({
            query : (inputdata) => ({
                url : 'login',
                method : 'POST',
                body : inputdata
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user : result.data.user}))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        logoutUser : builder.mutation({
            query : () => ({
                url : 'logout',
                method : 'GET',
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        loadUser : builder.query({
            query : () => ({
                url: 'profile',
                method: 'GET'
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user : result.data.user}))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        })
    })
})


export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useLoadUserQuery,
    useLogoutUserMutation,
    useUpdateUserMutation,
} = authApi;