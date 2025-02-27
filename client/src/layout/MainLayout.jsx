import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='h-screen'>
        <Navbar/>
        <div className='h-full dark:bg-gray-900 p-5'>
            <Outlet/> 
        </div>
    </div>
  )
}

export default MainLayout