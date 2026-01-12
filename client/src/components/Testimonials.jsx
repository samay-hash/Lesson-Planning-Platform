import React from 'react'
import { delay, easeIn, inView, motion } from 'framer-motion'



const testtis = [
    { user: "Samay", image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYoZOxbym-JFsvyG48OLldIKTwQRbU1hfvJA&s', feedback: "This platform makes lesson planning faster and smarter. It helps me create engaging classes with AI-powered insights. " },
    { user: "Samay", image: 'https://media.licdn.com/dms/image/v2/D4E35AQFZxnX9oI2MzQ/profile-framedphoto-shrink_400_400/B4EZr82a4mKgAg-/0/1765178716036?e=1768096800&v=beta&t=u8hBT329_TWGg1js8LAwka5RH8973dGnEqOhI4MF4KI', feedback: "“With this platform, I spend less time planning and more time teaching. The AI suggestions really improve my lessons.” " },
    { user: "Ranbir", image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBFEhnaIH-7vxs9rm-7FM81uzztc5l1gpXzQ0b8Aa1LY6vk_O5YbQSEhS_PkrflJZ52Z4FrFXy4WRt39dBnaCl6wjDPr4wHVs6v7tcvg&s=10', feedback: "This platform is an essential tool for modern classrooms. Its AI guidance helps me design clear, structured, and interactive lesson plans " },
    { user: "Ashish", image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTokwl-nvPD6R-_HhQzjNGI-gbx1mHibrGYLIBarnY-q6v0iMbm0UnCag-0SY8G4m1elAvQ11-2r7UjsiOYSgE4hpdsxiOCfLVKX5-XA&s=10', feedback: "This platform completely changed how I plan my classes. The AI insights save hours and help me teach with more confidence. " },
    { user: "Apoorva", image: 'https://static.toiimg.com/thumb/msid-122296918,width-1280,height-720,resizemode-4/122296918.jpg', feedback: "Smart planning, better lessons — this platform empowers my thinking with AI tools that simplify planning and make every class more engaging." },

]

const Testimonials = () => {
    const testiAnimation = {
        initial: { opacity: 0, x: -50 },
        inView: { opacity: 1, x: 0, transition: { duration: .5, ease: 'easeIn' } }
    }
    return (
        <motion.div variants={testiAnimation} initial='initial' whileInView='inView'>
            <ul className='grid sm:grid-cols-5 sm:gap-10 gap-5 mt-10 px-5 '>
                {
                    testtis.map(testis => (
                        <li key={testis.user} className='bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-all duration-300'>
                            <div className='text-[14px] text-slate-300'>"{testis.feedback}"</div>
                            <div className='flex justify-center items-center mt-5 gap-3'>
                                <img src={testis.image} width={30} height={40} alt="" className='rounded-full border border-cyan-500/30' />
                                <p className='text-xs text-cyan-400 font-semibold'>{testis.user}</p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </motion.div>
    )
}

export default Testimonials