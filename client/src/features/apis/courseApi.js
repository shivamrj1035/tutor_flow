import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = import.meta.env.VITE_BACKEND_URL+"course/"
export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ['refetch_courses', 'Refetch_Lecture'],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "/",
                method: "POST",
                body: { courseTitle, category }
            }),
            invalidatesTags: ['refetch_courses']
        }),
        getCreatorCourses: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
            }),
            providesTags: ['refetch_courses']
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `${courseId}`,
                method: "GET",
            }),
            providesTags: ['refetch_courses']
        }),
        removeCourse: builder.mutation({
            query: (courseId) => ({
                url: `${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["refetch_courses"],
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `${courseId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ['refetch_courses']
        }),
        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `${courseId}/lecture`,
                method: "POST",
                body: { lectureTitle }
            }),
            invalidatesTags: ['refetch_courses']
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ["Refetch_Lecture"],
        }),
        editLecture: builder.mutation({
            query: ({
                lectureTitle,
                videoInfo,
                isPreviewFree,
                courseId,
                lectureId,
            }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree },
            }),
            invalidatesTags: ["Refetch_Lecture"],
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Lecture"],
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET",
            }),
            providesTags: ["Refetch_Lecture"],
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `${courseId}/?publish=${query}`,
                method: "PATCH",
            }),
            invalidatesTags: ["refetch_courses"],
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: "published-courses",
                method: "GET"
            })
        }),
        getSearchCourses: builder.query({
            query: ({ searchQuery, categories, sortByPrice }) => {
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`
                if(categories && categories.length > 0){
                    const categoryData = categories.map(encodeURIComponent);
                    queryString += `&categories=${categoryData}`
                }
                if(sortByPrice){
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`
                }
                console.log('search', queryString)
                return {
                    url : queryString,
                    method : "GET",
                }
            }

        })
    })
})

export const {
    useCreateCourseMutation,
    useGetCreatorCoursesQuery,
    useGetCourseByIdQuery,
    useEditCourseMutation,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    useRemoveCourseMutation,
    usePublishCourseMutation,
    useGetPublishedCoursesQuery,
    useGetSearchCoursesQuery
} = courseApi