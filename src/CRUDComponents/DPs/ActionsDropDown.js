import React from 'react'
import { useState,useRef,useEffect }  from 'react'   
import { motion,AnimatePresence } from 'framer-motion'
import { Pencil,Trash2,MoreVertical,HeartPulse,Menu } from 'lucide-react'

export default function ActionsDropDown({onEdit,onDelete,onAddHealth}) {
    const [isOpen,setIsOpen]=useState(false)
    const dropdownRef=useRef()
    
    const toggleDropdown =()=> setIsOpen((pre)=>!pre)

    useEffect(()=>{
      const hundleClickOutside=(e)=>{
        if(dropdownRef.current && !dropdownRef.current.contains(e.target))
        {
            setIsOpen(false)
        }
      };
      document.addEventListener('mousedown',hundleClickOutside);
      return()=>document.removeEventListener('mousedown',hundleClickOutside)
    },[])
  return (
    <div className='relative inline-block   text-center ' ref={dropdownRef}>
      <button onClick={toggleDropdown}
      className='p-2 rounded-full  bg-gradient-to-r from bg-purple-500  to-indigo-500 shadow-lg hover:scale-105 transition-transform'
      >
        <MoreVertical size={18}/>
      </button>

      <AnimatePresence>
        {
            isOpen &&(
                <motion.div
                initial={{opacity:0,scale:0.95,y:-10}}
                animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:-10}}
                transition={{duration:0.2}}
                className='absolute right-0 z-50  w-48 bg-white  backdrop-blur-md shadow-xl border border-gray-200 rounded-xl overflow-hidden'
                >

                <button onClick={onEdit} className='flex items-center w-full px-4 py-2 text-sm text-gray-800  hover:bg-purple-100 transition-colors'>
                   <Pencil className='pr-8 h-4 w-4' /> Edit
                </button>

                <button onClick={onDelete} className='flex items-center w-full px-4 py-2 text-sm text-gray-800  hover:bg-purple-100 transition-colors'>
                   <Trash2 className='pr-8 h-4 w-4' /> Delete
                </button>
                <button onClick={onAddHealth} className='flex items-center w-full px-4 py-2 text-sm text-gray-800  hover:bg-purple-100 transition-colors'>
                   <HeartPulse className='pr-8 h-4 w-4' /> Add Health Issues
                </button>


                </motion.div>
            )
        }
      </AnimatePresence>
    </div>
  )
}
