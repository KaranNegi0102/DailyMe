import React from 'react'
import BlogNavbar from './../../../components/blog/navbar'; 
import BlogDisplay from '@/components/blog/blogDisplay';


export default function page () {
  return (
    <div className='bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      <BlogNavbar/>
      <BlogDisplay/>
      
    </div>
  )
}

