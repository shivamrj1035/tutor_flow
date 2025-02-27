import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '../../features/apis/courseProgressApi.js'
import {  CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge.jsx'
import { toast } from 'sonner'

const CourseProgress = () => {

  const params = useParams();
  const courseId = params.courseId;
  const [updateLectureProgress,] = useUpdateLectureProgressMutation();
  const [currentLecture, setCurrentLecture] = useState(null);
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [completeCourse, {data : markCompleteData, isSuccess : completedSuccess}]  = useCompleteCourseMutation();
  const [inCompleteCourse, {data : markInCompleteData, isSuccess : inCompletedSuccess}]  = useInCompleteCourseMutation();
  const { courseDetails, completed, progress } = data?.data || {};
  const { courseTitle } = courseDetails || {};

  const initialLecture = currentLecture || courseDetails?.lectures && courseDetails?.lectures[0];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
  }

  // Handle Selected Lecture play

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  }

  const handleLetureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  }

  const handleInCompleteCourse = async() =>{
    await inCompleteCourse(courseId);
  }

  const handleCompleteCourse = async() =>{
    await completeCourse(courseId);
  }

  useEffect(() => {
    console.log(markCompleteData);

    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  if (isLoading) return <p>LOading.....!</p>
  if (isError) return <p>Error.....!</p>
  return (
    <div className="max-w-7xl mx-auto mt-20 p-4">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {courseTitle} 
        </h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>


      <div className="flex flex-col md:flex-row gap-6 ">
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onEnded={() =>
                handleLetureProgress(currentLecture?._id || initialLecture._id)
              }
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2 dark:bg-[#2D2F31] p-2 border-r-4">
            <h3 className="font-medium text-lg">
              {`Lecture ${courseDetails.lectures.findIndex(
                (lec) =>
                  lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
                } : ${currentLecture?.lectureTitle || initialLecture.lectureTitle
                }`}
            </h3>
          </div>
        </div>
        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform dark:bg-[#2D2F31]
                ${lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:dark:bg-gray-800 text-blue-400"
                    : ""
                  }
                 `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )
                  }
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress