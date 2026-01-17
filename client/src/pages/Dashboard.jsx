import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { usernameState, lessonPlanForm } from '../recoil/createUser.recoil'
import Input from '../components/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faMessage, faChalkboardUser, faClock } from '@fortawesome/free-solid-svg-icons'
import { genereatePlan } from '../apiFrontend/CreatePlan'
import BlurReveal from '../components/BlurReveal'

const Dashboard = () => {
  const [username, setUsername] = useRecoilState(usernameState)
  const [lpFrom, setlpFrom] = useState(false)
  const [lessonPlanData, setLessonPlanData] = useRecoilState(lessonPlanForm)

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (user) {
      setUsername(user)
    }

  }, [])


  const handleInput = (e) => {
    const { name, value } = e.target

    setLessonPlanData((prevData) => ({
      ...prevData,
      [name]: name === "grade" || name === "duration" ? Number(value) : value
    }))
  }


  const [isLoading, setIsLoading] = useState(false);

  const SubmitLessonData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await genereatePlan(lessonPlanData);

      if (response?.data) {
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const downloadUrl = URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${lessonPlanData.topic}.docx`;  // Set a filename for the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(downloadUrl);

        setLessonPlanData({ subject: '', topic: '', grade: '', duration: '' })
        setlpFrom(false)
      }
    } catch (error) {
      console.log('Error downloading file:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className='flex flex-col items-center mt-24 min-h-[calc(100vh-6rem)] sm:px-0 px-4'>
      <div className='flex sm:gap-20 gap-2 items-center'>
        <h1 className='sm:text-3xl text-xl font-bold text-slate-800 dark:text-slate-100'>Welcome, {username}!</h1>
      </div>
      <div className='mt-10 w-full max-w-md bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-xl dark:shadow-black/20'>
        {
          lpFrom ? (
            isLoading ? (
              <BlurReveal isLoading={isLoading} />
            ) : (
              <form onSubmit={SubmitLessonData} className='space-y-6 text-center'>
                <div className='flex flex-col gap-2 text-left'>
                  <label htmlFor="subject" className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Subject</label>
                  <Input type='text' placeholder='e.g. Mathematics' name='subject' onChange={handleInput} icon={<FontAwesomeIcon icon={faBook} className="text-cyan-500" />} />
                </div>
                <div className='flex flex-col gap-2 text-left'>
                  <label htmlFor="topic" className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Topic</label>
                  <Input type='text' placeholder='e.g. Algebra' name='topic' onChange={handleInput} icon={<FontAwesomeIcon icon={faMessage} className="text-cyan-500" />} />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-2 text-left'>
                    <label htmlFor="grade" className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Grade</label>
                    <Input type='number' placeholder='1-12' name='grade' onChange={handleInput} icon={<FontAwesomeIcon icon={faChalkboardUser} className="text-cyan-500" />} />
                  </div>
                  <div className='flex flex-col gap-2 text-left'>
                    <label htmlFor="duration" className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Duration (min)</label>
                    <Input type='number' placeholder='45' name='duration' onChange={handleInput} icon={<FontAwesomeIcon icon={faClock} className="text-cyan-500" />} />
                  </div>
                </div>
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-200 mt-4'
                >
                  Generate Plan
                </button>
              </form>
            )
          ) :
            <div className="text-center py-8">
              <div className="mb-6 p-4 bg-cyan-500/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-cyan-500">
                <FontAwesomeIcon icon={faBook} size="2x" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Ready to teach?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">Create a comprehensive lesson plan in seconds using our AI-powered tool.</p>
              <button
                className='bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.05] transition-all duration-200'
                onClick={(e) => {
                  e.preventDefault()
                  setlpFrom(true)
                }}
              >
                Create Lesson Plan
              </button>
            </div>
        }
      </div>
    </div>
  )
}

export default Dashboard
