import React, { useState } from "react";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Notifications from './Notifications'
import { useLocation,Link } from "react-router-dom";
import {CiGrid41} from 'react-icons/ci'
import {BsJournalBookmark} from 'react-icons/bs'
import {HiMenuAlt1} from 'react-icons/hi'
import {IoIosNotificationsOutline} from "react-icons/io"
import { BsPerson } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import {CiLogout} from 'react-icons/ci'
import { adminFetchProfileAction } from "../../../redux/Actions/AdminActions";
import { connect } from 'react-redux';
import {CiWarning} from 'react-icons/ci'

function getToken() {
    const tokenString = sessionStorage.getItem('userToken');
    const userToken = JSON.parse(tokenString);
    return userToken
}


function DashboardLayout(props) {
    const [openAccount,setOpenAccount]=React.useState(false);
    const [openNotificationAction,setOpenNotificationAction]=React.useState(false);
    const location=useLocation();
    const [openMobileMenu,setOpenMobileMenu]=React.useState(false);
    const [sessionExpired,setSessionExpired]=useState(false)
    const navigate=useNavigate()


    const parseToken=(jwtToken)=>{
        try {
        return JSON.parse(atob(jwtToken.split('.')[1]));
        } catch (error) {
        return null
        }
    }

    
    React.useEffect(() => {
        props.adminFetchProfileAction();

    }, []) 

    const handleLogout=()=>{
        sessionStorage.removeItem('userToken')
        navigate("/users/admin/login",{replace:true})
    }


    return (
        <div className={`max-h-screen w-full overflow-hidden bg-primary grid grid-cols-6 relative`}>
            <Sidebar handleLogout={handleLogout}/>
            <div className={`mx-auto w-full min-h-screen max-h-screen overflow-hidden duration-1000 delay-300 ease-in-out bg-secondary bg-opacity-90 lg:col-span-5 col-span-6`}>
                <NavBar setOpenMobileMenu={setOpenMobileMenu} setOpenAccount={setOpenAccount} setOpenNotificationAction={setOpenNotificationAction} openAccount={openAccount} openNotificationAction={openNotificationAction}/>
                {props.children}
            </div>
            {openNotificationAction&&<Notifications openNotificationAction={openNotificationAction} setOpenNotificationAction={setOpenNotificationAction}/>}

            {/* Mobile menu */}

            {openMobileMenu &&
            <div className='bg-secondary bg-opacity-40 z-40 absolute top-0 right-0 bottom-0 left-0 max-h-screen transform duration-1000 delay-300 ease-in-out lg:hidden'>
                <div className="bg-primary pl-4 w-4/5 max-h-screen min-h-screen">
                    <div className="h-16 w-full text-lg py-2 text-secondary text-center flex justify-start gap-4" onClick={()=>setOpenMobileMenu(false)}>

                        <HiMenuAlt1 size={25}/>
                        <span className={`text-lg duration-500 ease-in-out `}>Menu</span>
                    </div>
                    <ul className="mt-8 font-semibold text-secondary p-0 list-none">
                        <li className={`flex w-full justify-between rounded-l-full py-2 pl-4 my-8   hover:text-opacity-70 cursor-pointer items-center mb-6 ${location.pathname==="/users/admin/profile" && ' bg-secondary bg-opacity-90 text-text_secondary'}  `}>
                            {props?.data?.adminProfile?.success?(
                            <Link to="" className="py-2 border-text_secondary_2 w-full flex gap-2 justify-start">
                                <div className="h-10 w-10 rounded-full">
                                    <img 
                                    src={!props?.data?.memberProfile?.resp?.data?.getProfile?.profilePicture?'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png':`${props?.data?.memberProfile?.resp?.data?.getProfile?.profilePicture}`} className='w-full h-full object-cover rounded-full'/>
                                </div>
                
                                <div className="grid">
                                    <label className="font-bold text-md">{props?.data?.adminProfile?.resp?.data?.getProfile?.fullNames}</label>
                                    <p className='text-xs'>View my profile</p>
                                </div>
                                
                            </Link>):(
                                <p></p>
                            )}
                        </li>
                        <li className={`w-full py-2 rounded-l-full ${location.pathname==="/users/admin/home"&&'bg-secondary bg-opacity-90 text-text_secondary'}   hover:text-opacity-70 cursor-pointer items-center mb-6`}>
                            <Link to="/users/admin/home" className="flex justify-start px-3">
                                <CiGrid41 size={25}/>
                                <span className={`text-sm  ml-4 duration-500 ease-in-out`}>Home</span>
                            </Link>
                        </li>
                        <li className={`w-full py-2 rounded-l-full  hover:text-opacity-70 cursor-pointer mb-6 ${location.pathname==="/users/admin/courses" && ' bg-secondary bg-opacity-90 text-text_secondary'}  `}>
                            <Link to="/users/admin/courses" className="flex justify-start px-3">
                                <BsJournalBookmark size={25}/>
                                <span className={`text-sm  ml-4 duration-500 ease-in-out `}>Courses</span>
                            </Link>
                        </li>

                        <li className={`flex relative w-full rounded-l-full py-2 pl-2  hover:text-opacity-70 cursor-pointer items-center mb-6 ${location.pathname==="/users/admin/notifications" && ' bg-secondary bg-opacity-90 text-text_secondary'}  `}>
                            <Link to="/users/admin/courses" className="flex items-center px-3">
                                <IoIosNotificationsOutline size={25}/>
                                <span className={`text-sm  ml-4 duration-500 ease-in-out `}>Notifications</span>
                            </Link>
                            <label className='bg-danger w-4 h-4 rounded-full absolute left-4 top-1 text-secondary text-[9px] p-0.5'>
                                10
                            </label>
                        </li>
                        <li className={`flex w-full justify-between rounded-l-full py-2 pl-2  hover:text-opacity-70 cursor-pointer items-center mb-6 ${location.pathname==="/users/admin/profile" && ' bg-secondary bg-opacity-90 text-text_secondary'}  `}>
                            <Link to="/users/admin/profile" className="flex items-center px-3">
                                <BsPerson  size={25}/>
                                <span className={`text-sm  ml-4 duration-500 ease-in-out `}>My profile</span>
                            </Link>
                        </li>
                        <li className={`flex w-full justify-between rounded-l-full py-2 pl-2  hover:text-opacity-70 cursor-pointer items-center mb-6`} onClick={()=>handleLogout()}>
                            <div className="flex items-center px-3">
                                <CiLogout  size={25}/>
                                <span className={`text-sm  ml-4 duration-500 ease-in-out `}>Logout</span>
                            </div>
                        </li>

                    </ul>
                </div>
                
            </div>
            }
            {props?.data?.adminProfile?.error?.response?.data?.message==='Not Authorized token expired, Please Login again' &&
                <div className="min-h-screen max-h-screen w-full left-0 right-0 z-40 flex justify-center items-center absolute top-0 bg-primary bg-opacity-40">
                    <div className="lg:w-2/5 px-8 py-4 rounded-lg shadow-lg w-full bg-secondary">
                        <div className="flex justify-start gap-4">
                            <div className="bg-secondary  text-text_secondary h-12 w-12 p-2 rounded-full text-center flex items-center">
                                <CiWarning size={50}/>
                            </div>
                            <div className="text-text_secondary">
                                <h1 className="font-bold">Your session has been expired</h1>
                                <label className="text-sm">Please log in again to continue using the app.</label>
                            </div>
                            
                        </div>
                        <div className="flex w-full justify-end">
                            <button className="bg-primary text-sm p-2 text-secondary" onClick={()=>handleLogout()}>Sign in</button>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    );
}

const mapState=(data)=>({
    data:data
  })
  
  export default connect(mapState,{
    adminFetchProfileAction
  }) ( DashboardLayout);

