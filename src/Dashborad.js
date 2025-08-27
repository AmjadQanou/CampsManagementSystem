import React, { useContext, useEffect, useState } from 'react'
import SideBar from './DashboardComponents/SideBar';
import NavBar from './DashboardComponents/NavBar';
import Main from './DashboardComponents/main';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import Mycamp from './DashboardComponents/Mycamp';
import MyOrg from './DashboardComponents/MyOrg';
export default function Dashborad() {
  const{user}=useContext(AuthContext)
  const navigate=useNavigate()
  useEffect(()=>{
    // if(  user.role=="CampManager")
    // {
    //   navigate("/mycamp")
    // }
    // else if( user.role=="OrganizationManager")
    // {
    //   navigate("/myorg")
    // }
    // else if(user.role=="SystemManager")
    // {
    //   navigate("/admindash")

    // }
  },[0])


  return (
   <div class="antialiased bg-gray-50 dark:bg-gray-900">
    {/* <NavBar/> */}
    <SideBar/>

    <main class="p-4  h-auto pt-10" style={{marginRight:"230px"}}>
          <Outlet/>
    </main>
  </div>
  )
}




