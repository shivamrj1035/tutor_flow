import { Menu, School } from 'lucide-react';
import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DarkMode } from '@/DarkMode';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/apis/authApi.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export const Navbar = () => {
    // const user = true;
    const { user } = useSelector(store => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "User log out.");
            navigate("/login");
        }
    }, [isSuccess]);

    return (
        <div
            className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 fixed top-0 left-0 right-0 duraion-300 z-10'>
            {/* Desktop */}
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
                <div className="flex items-center gap-2">
                    <School />
                    <h1 className='hidden md:block  font-extrabold text-2xl'><Link to="/">T
                        {/* NM-Training Platform */}
                    </Link>
                    </h1>
                </div>
                <div className="flex items-center gap-8">
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <Link to="my-learning">
                                            <DropdownMenuItem className="cursor-pointer" >
                                                My Learning
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to="profile">
                                            <DropdownMenuItem className="cursor-pointer">
                                                Profile
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem onClick={logoutHandler}>
                                            Logout
                                            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />

                                    {
                                        user.role === "instructor" &&
                                        (<DropdownMenuItem onClick={() => navigate(`admin/dashboard`)}>
                                            My DashBoard
                                        </DropdownMenuItem>)
                                    }

                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                            : (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => navigate("login")}>Login</Button>
                                    <Button onClick={() => navigate("login")}>Signup</Button>
                                </div>
                            )
                    }
                    <DarkMode />
                </div>
            </div>
            {/* Mobile Device */}
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <h1 className="font-extrabold text-2xl">E-Training</h1>
                <MobileNavbar user={user} />
            </div>
        </div>
    )
}

export default Navbar;


const MobileNavbar = () => {
    const { user } = useSelector(store => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "User log out.");
            navigate("/login");
        }
    }, [isSuccess]);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle>
                        <span>E-Training</span>
                        {/* <Link to="/">E-Learning</Link> */}
                    </SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className="mr-2" />
                <nav className="flex flex-col space-y-4">
                    <span><Link to="my-learning">My Learning</Link></span>
                    <span><Link to="profile">Profile</Link></span>
                    <p onClick={logoutHandler}>Log out</p>
                </nav>
                
                <SheetFooter className="w-full">
                    <SheetClose asChild>
                        <Button type="submit" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button onClick={() => navigate("/admin/course")}>Courses</Button>
                    </SheetClose>
                </SheetFooter>
                {/* )} */}
            </SheetContent>
        </Sheet>
    )
}