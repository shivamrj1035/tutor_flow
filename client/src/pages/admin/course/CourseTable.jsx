import { Button } from '@/components/ui/button'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useGetCreatorCoursesQuery } from '@/features/apis/courseApi';

const CourseTable = () => {
    const navigate = useNavigate();
    const {data, isLoading}= useGetCreatorCoursesQuery();
    console.log(data);
    const courses = data?.courses;

    return (
        <div className='sm:mt-20'>
            <Button onClick={() => navigate("create")} className="mb-10" >Create a new course</Button>
            <Table>
                <TableCaption className="my-5">A list of your recent courses.</TableCaption>
                <TableHeader  className="my-1 bg-gray">
                    <TableRow>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="my-5">
                    {courses && courses.map((course) => (
                        <TableRow key={course?.courseTitle}>
                            <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
                            <TableCell> <Badge>{course?.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
                            <TableCell>{course?.courseTitle}</TableCell>
                            <TableCell className="text-right">
                                <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CourseTable