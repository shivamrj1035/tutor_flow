import React from 'react'
import {useSelector} from "react-redux";
import Course from "@/pages/learner/Course.jsx";
import { useLoadUserQuery } from '@/features/apis/authApi';

const MyLearning = ({course}) => {

    const {data, isLoading} = useLoadUserQuery();
    const myLearnings = data?.user?.enrolledCourses || [];
    

    return (
        <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
            <h1 className="font-bold text-2xl">MyLearning</h1>
            <div className="my-7">
                {isLoading ? (<MyLearningSkeleton/>) : myLearnings.length === 0 ?
                    <p>You are not enrolled in any courses!</p> :
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 ">
                        {myLearnings.map((course, index) => (<Course key={index} course={course}/>))}
                    </div>
                }
            </div>
        </div>)
}

export default MyLearning;

const MyLearningSkeleton = () => (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (<div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
    ></div>))}
</div>);