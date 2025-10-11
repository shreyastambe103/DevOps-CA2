//import { Sidebar } from 'flowbite-react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import CustomSideBar from './CustomSidebar';

const DashboardLayout = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row'>
      <CustomSideBar/>
      <Outlet/>
    </div>
  )
}

export default DashboardLayout;
