import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/features/apis/courseApi';


const Courses = () => {

    // const isLoading = false;
    const {data, isLoading, isSuccess,error, isError } = useGetPublishedCoursesQuery();
    if(isError){
        return <h1 className='w-full flex justify-center items-center'>Error : <span className='text-red-600'> {error.data.message}</span></h1>
    }
    const courses = [1,2,3,4,5,6,7];
    return (
        <div className='bg-gray-50 dark:bg-gray-500'>
            <div className="max-w-7xl mx-auto p-6">
                <h2 className='font-bold text-3xl text-center mb-10'>Our Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {
                    isLoading ? 
                    Array.from({length : 8}).map((_, index) => (
                        <CourseSkeleton key={index}/> 
                    ))
                    : data?.courses.map((course,index) => (
                        <Course course={course} key={index}/>
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default Courses;

export const CourseSkeleton = () => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36" />
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
};

