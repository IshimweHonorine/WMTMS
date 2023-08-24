import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import YoutubeEmbed from './YoutubeEmbed'
import {PiDotsNineBold} from 'react-icons/pi'
import {BsArrowRight,BsArrowLeft} from 'react-icons/bs'
import { connect } from 'react-redux'
import { fetchAllCoursesLessons, fetchOneCoursesLesson } from '../redux/Actions/CoursesAction'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { fetchOneCourses } from '../redux/Actions/CoursesAction'
import axios from '../redux/Actions/axiosConfig'
import {TiTick} from 'react-icons/ti'

const Lesson = (props) => {

    const params=useParams()
    const location=useLocation()
    const navigate=useNavigate()
    const [error,setError] = React.useState("")
    const [loading,setLoading]=React.useState(false);

    const courseLessons=props?.data?.courseLessons?.resp?.data
    const [idToIndexMap, setIdToIndexMap] = useState({});
    const[currentIndex,setCurrentIndex]=useState(0);

    const goToNext = () => {
        if (currentIndex < props?.data?.courseLessons?.resp?.data.length - 1) {
          navigate(`${location.pathname.replace(/\/lesson\/[^/]+$/, '')}/lesson/${props?.data?.courseLessons?.resp?.data[currentIndex+1]?._id}`)
        }
    };
    const goToPrev = () => {
        if (currentIndex > 0) {
            navigate(`${location.pathname.replace(/\/lesson\/[^/]+$/, '')}/lesson/${props?.data?.courseLessons?.resp?.data[currentIndex-1]?._id}`)
        }
    };


    const completeLesson=async()=>{
        setLoading(true);

        try {
            const response = await axios.patch(`${process.env.BACKEND_URL}/member/complete/${params.lesson}`);
      

	        setDataMsg(response.data.message);

          } catch (error) {
            setError(error?.response?.data?.message?error?.response?.data?.message:error?.message);
            console.log(error);
        }
        setLoading(false);
        props.fetchOneCoursesLesson(params.id,params.lesson);
        
    }


    useEffect(()=>{

        const newIdToIndexMap = {};
        courseLessons?.forEach((element, index) => {
          newIdToIndexMap[element._id] = index;
        });
        setIdToIndexMap(newIdToIndexMap);
    
        if (params.lesson) {
          const targetIndex = newIdToIndexMap[params.lesson];
          if (targetIndex !== undefined) {
            setCurrentIndex(targetIndex);
          }
        }

        props.fetchAllCoursesLessons(params.id);
        props.fetchOneCoursesLesson(params.id,params.lesson);
        props.fetchOneCourses(params.id)
    },[params])


  return (
        <div className='w-full grid lg:grid-cols-4 lg:pl-8'>
            <div className='min-h-screen max-h-screen overflow-y-hidden hidden lg:block  pt-4'>
                <header className='bg-primary px-2'>
                    <h1 className="text-secondary font-bold text-xs py-2">{props?.data?.oneLesson?.resp?.data?.getLesson?.Course?.courseTitle}</h1>
                </header>
                {props?.data?.courseLessons?.success?(
                    <ul className='overflow-y-auto max-h-screen pb-28 list-none p-0 min-h-screen  border-r border-primary '>
                        {props?.data?.courseLessons?.resp?.data?.map((lesson,index)=>(
                            <li 
                            className={`my-2 relative ${!location.pathname.includes("users/admin/courses") && lesson?.completedBy.some(async(obj) => obj._id === await props?.data?.memberProfile?.resp?.data?.getProfile?._id) && 'border-l-4 border-l-primary w-full'} pl-2  `} key={index}>
                                {!location.pathname.includes("users/admin/courses") && lesson?.completedBy.some(async(obj) => obj._id === await props?.data?.memberProfile?.resp?.data?.getProfile?._id) &&<TiTick size={20} className='text-primary absolute right-4'/>}
                                <Link to={`/${props.path}/${params.id}/lesson/${lesson?._id}`}
                                 className={`${lesson?._id==params.lesson?'text-primary font-bold underline':'text-text_secondary'} break-words text-xs hover:text-primary hover:underline delay-100 duration-500`}><span className='font-semibold'>{index+1}:</span>{lesson?.lessonTitle}.</Link>
                            </li>
                        ))}
                        

                    </ul>
                ):(
                    <p></p>
                )}
            </div>
            <div className='col-span-3 overflow-y-auto max-h-screen min-h-screen lg:px-8 px-4 w-full lg:pb-32 relative pt-4'>

                {props?.data?.oneLesson?.success?(
                <>
                <div className='flex justify-between gap-4 text-text_secondary'>
                    <h1 className='text-lg'>{props?.data?.oneLesson?.resp?.data?.getLesson?.lessonTitle}</h1>
                    <div className='relative group cursor-pointer'>
                        <PiDotsNineBold size={20}/>

                        <ul className='text-sm absolute right-0 bg-secondary w-20 hidden group-hover:block p-0 list-none'>
                            <li className='p-2 hover:text-primary text-center'>Edit</li>
                            <li className='p-2 hover:text-primary text-center'>Delete</li>
                        </ul>
                    </div>
                </div>            
                <YoutubeEmbed embedId={props?.data?.oneLesson?.resp?.data?.getLesson?.lessonVideoId}/>

                <div className='py-4 text-text_secondary'>
                    <h3 className='border-b border-primary font-bold mb-6'>Notes</h3>

                    <div className="leading-8 text-justify text-md text-text_secondary text-sm" dangerouslySetInnerHTML={{ __html: props?.data?.oneLesson?.resp?.data?.getLesson?.Notes }} />
                </div>
                {!location.pathname.includes("users/admin/courses") &&
                    <div className='flex justify-between mb-3'>
                        <button onClick={()=>goToPrev()} className={`px-3 border border-primary text-primary font-bold rounded-lg py-1 ${currentIndex<=0?'cursor-not-allowed opacity-50':'cursor-pointer'}`} disabled={currentIndex<=0?true:false}>
                            <BsArrowLeft size={20}/>
                        </button>

                        {props?.data?.oneLesson?.resp?.data?.getLesson?.completedBy.some(async(obj) => obj._id === await props?.data?.memberProfile?.resp?.data?.getProfile?._id)?(
                            <button size='sm' className={`px-3 border border-text_secondary text-text_secondary opacity-20 cursor-not-allowed font-bold rounded-lg py-1`} disabled={true}>
                                Completed                               
                            </button>
                        ):(

                            <button onClick={()=>completeLesson()} className={`px-3 border border-primary text-primary font-bold rounded-lg py-1`}>
                                {loading?<p className="flex justify-center gap-2"><AiOutlineLoading3Quarters size={20} className="animate-spin h-5 w-5"/></p>:'Mark it as complete'}
                            </button>
                        )}

                        <button onClick={()=>goToNext()} className={`px-3 border border-primary text-primary font-bold rounded-lg py-1 ${currentIndex >= props?.data?.courseLessons?.resp?.data.length - 1?'cursor-not-allowed opacity-50':'cursor-pointer'}`} disabled={currentIndex > props?.data?.courseLessons?.resp?.data.length - 1?true:false}>
                            <BsArrowRight size={20}/>
                        </button>
                    </div>
                }
                </>
                ):(
                    <p className={`text-sm text-danger text-center p-2 ${props?.data?.oneLessonr?.error && 'bg-danger'} bg-opacity-20`}>{props?.data?.oneLessonr?.error?.response?.data?.message}</p>
                )}
            </div>
        </div>
        
  )
}

const mapState=(data)=>({
    data:data
})
export default connect(mapState,{
    fetchAllCoursesLessons,
    fetchOneCoursesLesson,
    fetchOneCourses
})(Lesson)