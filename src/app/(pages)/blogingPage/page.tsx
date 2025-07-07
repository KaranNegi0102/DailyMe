import React from 'react'
import BlogNavbar from './../../../components/blog/navbar'; 
import BlogDisplay from '@/components/blog/blogDisplay';


export default function page () {
  return (
    <div className='bg-[#f6ebeb]'>
      <BlogNavbar/>

      <BlogDisplay/>
      
    </div>
  )
}

