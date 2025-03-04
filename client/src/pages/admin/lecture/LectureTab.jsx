import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/apis/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_URL = `${import.meta.env.VITE_BACKEND_URL}media`
const LectureTab = () => {
    // const isLoading = false;
    // const removeLoading = false;

    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        // console.log('here it is')
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_URL}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    },
                });

                if (res.data.success) {
                    console.log(res);
                    setUploadVideoInfo({
                        videoUrl: res.data.data.url,
                        publicId: res.data.data.public_id,
                    });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error)
                toast.error("video upload failed");
            } finally {
                setMediaProgress(false);
            }
        }
    }

    const params = useParams();
    const courseId = params.courseId;
    const lectureId = params.lectureId;
    const navigate = useNavigate();
    // Edit Lecture 
    const [editLecture, { data, isLoading, error, isSuccess, }] = useEditLectureMutation();
    const editLectureHandler = async () => {
        await editLecture({
            lectureTitle,
            videoInfo: uploadVideInfo,
            isPreviewFree: isFree,
            courseId,
            lectureId,
        })
    }
    useEffect(() => {
        if (isSuccess) {
            navigate(`/admin/course/${courseId}/lecture`)
          toast.success(data.message);
        }
        if (error) {
          toast.error(error.data.message);
        }
      }, [isSuccess, error]);
    // Get lecture
    const { data: lectureData } = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoInfo)
        }

    }, [lecture])


    // Remove Lecture
    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();
    const removeLectureHandler = async () => {
        await removeLecture(lectureId)
    }

    useEffect(() => {
        if (removeSuccess) {
            navigate(`/admin/course/${courseId}/lecture`)
            toast.success(removeData.message);
        }
    }, [removeSuccess])
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription className="mt-2">
                        Make changes and click save when done.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}
                    >
                        {
                            removeLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        type="text"
                        placeholder="Ex. Introduction to Javascript"
                    />
                </div>
                <div className="my-5">
                    <Label>
                        Video <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex. Introduction to Javascript"
                        className="w-fit"
                        disabled={mediaProgress}
                    />
                </div>
                {mediaProgress && (
                    <div className="my-4">
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}
                <div className="flex items-center space-x-2 my-5">
                    <Switch
                        checked={isFree} onCheckedChange={setIsFree}
                        id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Is this video FREE</Label>
                </div>


                <div className="mt-4">
                    <Button
                        disabled={mediaProgress}
                        onClick={editLectureHandler}
                    >
                        {
                            isLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Update Lecture"
                        }

                    </Button>
                </div>
            </CardContent>
        </Card>

    )
}

export default LectureTab;