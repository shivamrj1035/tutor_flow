import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useRemoveCourseMutation, } from '@/features/apis/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {


    const [editCourse, { isLoading, isSuccess, error, data }] = useEditCourseMutation();
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        level: "",
        category: "",
        coursePrice: "",
        thumbnail: "",
    })
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;
    

    // Remove Course
    const [removeCourse, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveCourseMutation();
    const removeCourseHandler = async () => {
        await removeCourse(courseId)
    }

    useEffect(() => {
        if (removeSuccess && removeData) {
            navigate(`/admin/course/`)
            toast.success(removeData.message);
        }
    }, [removeSuccess, removeData])
    // Publish - Unpublish
    const [publishCourse, {data : publishData}] = usePublishCourseMutation();
    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                refetch();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course");
        }
    }


    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId);
    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course;

            setInput(
                {

                    courseTitle: course?.courseTitle || "",
                    subTitle: course?.subTitle && course.subTitle !== "undefined" ? course.subTitle : "",
                    description: course?.description && course.description !== "undefined" ? course.description : "",
                    category: course?.category || "",
                    level: course?.level || "",
                    coursePrice: course?.coursePrice || "",
                }
            );
            
            if (course?.thumbnail) {
                setPreviewThumbnail(course.thumbnail)
            }
        }
    }, [courseByIdData]);


    const changeEventHandler = (event) => {
        const { name, value } = event.target;
        setInput({ ...input, [name]: value })
    }


    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };
    const selectCourseLevel = (value) => {
        setInput({ ...input, level: value });
    };
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, thumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file)
        }
    }



    const handleSave = async () => {
        if(!input.courseTitle || !input.subTitle || !input.description || !input.level || !input.category || !input.coursePrice || !input.thumbnail){
            toast.error('Please fill all given fields')
            return;
        }
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("level", input.level);
        formData.append("category", input.category);
        formData.append("coursePrice", input.coursePrice);
        formData.append("thumbnail", input.thumbnail);
        await editCourse({ formData, courseId });
        console.log(input)
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || 'Updated Successfully')
        }
        if (error) {
            toast.error(data.error.message || 'Error in updation')
        }
    }, [isSuccess, error])

    if (courseByIdLoading) return <Loader2 />
    




    return (
        <Card className="dark:bg-gray-700"> 
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription className="mt-2">
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2 sm:flex sm:flex-col sm: gap-3">
                    <Button disabled={courseByIdData?.course?.lectures.length === 0} variant="outline" onClick={() => publishStatusHandler(courseByIdData?.course?.isPublished ? "false" : "true")}>
                        {courseByIdData?.course?.isPublished ? "Unpublished" : "Publish"}
                    </Button>
                    <Button
                    disabled={removeLoading}
                        onClick={() => removeCourseHandler()}
                    >
                        {
                            removeLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Remove Course"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor
                            input={input} setInput={setInput}
                        />
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select
                                onValueChange={selectCategory}
                                value={input.category}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select
                                onValueChange={selectCourseLevel}
                                value={input.level}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit"
                        >
                        </Input>
                        {
                            previewThumbnail && (
                                <img
                                    src={previewThumbnail}
                                    className="my-2 h-40 w-64 object-cover rounded-lg border border-gray-300 shadow-lg"
                                    alt="Course Thumbnail"
                                />
                            )

                        }
                    </div>
                    <div className="space-x-2">
                        <Button onClick={() => navigate("/admin/course")} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={isLoading}
                            onClick={handleSave}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab