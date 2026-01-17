import React, { useEffect } from 'react'
import { delay, easeIn, easeOut, inView, motion } from 'framer-motion'
import Button from '../components/Button'
import EduCtor from '../assets/illustrations/illustrationOne.svg'
import AITeacher from '../assets/illustrations/aiTeacher.svg'
import Testimonials from '../components/Testimonials'
import { useRecoilState } from 'recoil'
import { userProfileState } from '../recoil/createUser.recoil'
// import FloatingParticles from '../components/ui/FloatingParticles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faRocket } from '@fortawesome/free-solid-svg-icons'
import BlurHeadline from '../components/BlurHeadline'

const Home = () => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState)

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (username) setUserProfile(true)

  }, [])


  const headerAnimation = {
    initial: { opacity: 0, y: -20 },
    inView: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  }
  const cardFrammer = {
    initial: { opacity: 0, x: -50 },
    inView: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeOut' } }
  }
  return (
    <div className='relative text-center sm:pt-48 sm:mt-7 mt-20 pb-32 min-h-screen'>
      <div className="absolute inset-0 z-0">
        {/* FloatingParticles removed */}
      </div>

      <div className="relative z-10 font-sans">
        <motion.div variants={headerAnimation} initial='initial' whileInView='inView' className='sm:px-20 px-10 overflow-hidden flex flex-col items-center justify-center'>
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 text-sm font-medium backdrop-blur-sm">
            Next-Gen Lesson Planning
          </div>

          <BlurHeadline
            text="Streamline Your Lessons, Empower Your Teaching"
            className="sm:text-[72px] text-[36px] font-bold tracking-tight leading-none text-slate-900 dark:text-slate-100"
          />

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Harness the power of AI to create engaging, structured, and personalized lesson plans in seconds.
          </p>
          {
            !userProfile ? <Button className='mt-10 scale-125' prop={"Get Started Free"} link='/auth/signin' /> :
              <Button className='mt-10 scale-125' prop={"Create Lesson Plan"} link='/dashboard' />
          }
        </motion.div>

        <motion.div initial="initial" whileInView="inView" variants={cardFrammer} className='grid sm:grid-cols-2 mt-32 sm:mx-20 mx-5 gap-8'>
          <div className='group flex sm:flex-row flex-col justify-center items-center bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-black/20'>
            <img src={AITeacher} alt="" className='sm:h-[150px] h-[100px] sm:w-[150px] w-[100px] drop-shadow-lg group-hover:scale-110 transition-transform duration-300' />
            <div className="text-left sm:ml-6 mt-4 sm:mt-0">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">AI Solutions</h3>
              <p className='text-sm text-slate-500 dark:text-slate-400'>Smart tools for your everyday classes, tailored to your needs.</p>
            </div>
          </div>

          <div className='flex flex-col gap-8'>
            <div className='group flex items-center p-6 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-black/20'>
              <div className="mr-6 bg-cyan-500/10 dark:bg-cyan-500/20 p-4 rounded-full text-cyan-600 dark:text-cyan-400">
                <FontAwesomeIcon icon={faLayerGroup} className="text-2xl" />
              </div>
              <div className="text-left">
                <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1'>Customized Plans</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Lesson plans designed with the proper pedagogical methods.</p>
              </div>
            </div>

            <div className='group flex items-center p-6 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-black/20'>
              <div className="mr-6 bg-purple-500/10 dark:bg-purple-500/20 p-4 rounded-full text-purple-600 dark:text-purple-400">
                <FontAwesomeIcon icon={faRocket} className="text-2xl" />
              </div>
              <div className="text-left">
                <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1'>Maximize Productivity</h3>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Improve your teaching style with data-driven AI insights.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className='mt-32 sm:px-36 px-10'>
          <BlurHeadline
            text="Trusted by Educators"
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-500 bg-clip-text text-transparent mb-12"
          />
          <Testimonials />
        </div>
      </div>
    </div>
  )
}

export default Home