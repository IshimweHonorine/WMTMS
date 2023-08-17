import React from 'react'
import {IoCloseOutline} from 'react-icons/io5'
import Card from '../components/Card'
import {BsArrowRight,BsSearch} from 'react-icons/bs'
import { useLocation } from 'react-router-dom'
import { fetchAllCourses } from '../redux/Actions/CoursesAction'
import { fetchAllCategory } from '../redux/Actions/CategoryAction'
import { connect } from 'react-redux'
import Loading from './Loading'
import { fetchAllLectures } from '../redux/Actions/LecturesAction'

const cards=[1,2,3,4,5,6,7,8,9,0]

const Courses = (props) => {
    const [toogleSearch,setToogleSearch]=React.useState(false);
    const location=useLocation()

    React.useEffect(()=>{
        props.fetchAllCourses()
        props.fetchAllCategory()
        props.fetchAllLectures()
    },[])


  return (
    <div className='mb-4 py-2'>
        <div className='lg:flex justify-end gap-4 relative'>
            <div className='flex lg:justify-end justify-between lg:gap-4 gap-2 w-full h-8 text-text_secondary font-medium lg:px-8'>
                <label className='text-primary cursor-pointer delay-100 duration-500  border-b-2'>All</label>
                {props.data?.allCategories?.success?(
                    props?.data?.allCategories?.resp?.data.map((category)=>(
                        <label key={category._id} className='cursor-pointer  hover:border-b-2'>{category.categoryName}</label>
                    ))
                ):(<p></p>)}
                <div className='text-text_secondary font-bold relative text-lg mt-1'>
                    <BsSearch  className='cursor-pointer hover:text-primary' onClick={()=>setToogleSearch(!toogleSearch)}/>
                </div>
            </div>                    
        </div>

        <div className={`text-text_secondary font-bold relative py-2 shadow-sm ${toogleSearch?'block':'hidden'}`}>
            <BsSearch size={20} className='cursor-pointer hover:text-primary absolute top-4 left-4'/>
            <input type="text" className="px-12 text-text_secondary text-sm outline-none block w-full p-2.5 dark:bg-gray-700 placeholder-text_secondary_2" placeholder="Type in keyword" autoFocus="autofocus" required/>
            <IoCloseOutline size={20} className='cursor-pointer hover:text-primary absolute top-4 right-4'/>
        </div>
        {props?.data?.allCourses?.loading?(
            <Loading size={30}/>
        ):(props.data?.allCourses?.success?(
            props?.data?.allCourses?.resp?.data?.length <=0?(
                <p className='text-text_secondary text-center text-sm py-8 px-8'>No course added yet</p>
            ):(
            <div className={`grid lg:grid-cols-4 gap-8 py-2 my-4`}>              
                {props?.data?.allCourses?.resp?.data.map((course,index)=>(
                    <Card key={index} id={index} path={props.path}/>
                ))}
            </div>
            )
        ):(
            <p></p>
        ))}
        
    </div>
  )
}

const mapState=(data)=>({
    data:data
})

export default connect(mapState,{
    fetchAllCourses,
    fetchAllCategory,
    fetchAllLectures
})(Courses)