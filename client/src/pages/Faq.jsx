import React from 'react'
import {motion } from 'framer-motion'

const Faq = () => {
  return (
    <div className='flex flex-col text-center my-56 mx-10'>
      <h1 className='sm:text-5xl text-xl'>The server might go down
        <span className='bg-gradient-to-r from-cyan-500 to-blue-700 bg-clip-text text-transparent font-bold'> anytime </span> 
        because <span className='font-bold bg-gradient-to-r from-cyan-500 to-blue-700 bg-clip-text text-transparent'>it’s deployed on Render’s free plan.</span>🥲<br />  </h1>
      
    </div>
  )
}

export default Faq