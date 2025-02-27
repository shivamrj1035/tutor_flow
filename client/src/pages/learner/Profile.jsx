import React, {useEffect} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Loader2} from "lucide-react";
import Course from "@/pages/learner/Course.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {useLoadUserQuery, useUpdateUserMutation} from "@/features/apis/authApi.js";
import userImg from "../../assets/user.jpg";
import {useState} from "react";
import {toast} from "sonner";

const Profile = () => {

    // const isLoading = true;
    const enrolledCourses = [1, 2, 3, 4, 5, 6];
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");


    const { data, isLoading, refetch} = useLoadUserQuery();
    const [
        updateUser,
        {
            data: updateUserData,
            isLoading: updateUserIsLoading,
            isError,
            error,
            isSuccess,
        },
    ] = useUpdateUserMutation();
    useEffect(() => {
        if(isSuccess){
            refetch();
            toast.success(data.message || "Successfully updated user");
        }
        if(isError){
            toast.error(error.message || "Profile failed to update");
        }
    }, [isError,isSuccess,updateUserData,error]);
    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    };

    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);
    };
    // const {user} = data;

    const user = data?.user;

    useEffect(()=>{
        refetch()
    },[])
    return (
        <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
            <h1 className="font-bold text-2xl">My Profile</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage
                            src={user?.photoUrl || userImg}
                            alt="Profile Image"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Name:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                            {isLoading || (!user) ? <Skeleton className="w-32 h-5 ml-2 inline-block"/> : user.name}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Email:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                            {isLoading || (!user) ? <Skeleton className="w-32 h-5 ml-2 inline-block"/> : user.email}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                            Role:
                            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                            {isLoading || (!user) ? <Skeleton className="w-32 h-5 ml-2 inline-block"/> : user.role}
                            </span>
                        </h1>
                    </div>
                    <div className="mb-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">
                                            Name
                                        </Label>
                                        <Input type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="col-span-3"/>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">
                                            Profile Photo
                                        </Label>
                                        <Input type="file" onChange={onChangeHandler} accept="image/*" className="col-span-3"/>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button disabled={updateUserIsLoading} onClick={updateUserHandler} type="submit">
                                        {
                                            updateUserIsLoading  ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                                    </>
                                                )
                                                : (
                                                    "Save changes"
                                                )
                                        }
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="font-medium text-lg">Courses you're Enrolled in</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                    {
                        !user
                            ?
                            Array.from({length: 3}).map((_, idx) => <CourseSkeleton key={idx}/>)
                            :
                            user?.enrolledCourses.length === 0 ? (
                                <h1>You haven't enrolled yet</h1>
                            ) : (
                                user?.enrolledCourses.map((course, idx) => (
                                    <Course course={course} key={course._id}/>
                                ))
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;


export const CourseSkeleton = () => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36"/>
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4"/>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full"/>
                        <Skeleton className="h-4 w-20"/>
                    </div>
                    <Skeleton className="h-4 w-16"/>
                </div>
                <Skeleton className="h-4 w-1/4"/>
            </div>
        </div>
    );
};

