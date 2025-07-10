import logo from './assets/logo.png'
import { useState } from 'react'
import SkillTreePage from './SkillTreePage'

function App() {
  const [inputValue, setInputValue ] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse(null)
    console.log('Submitted:', inputValue)

    try {
      const res = await fetch('http://127.0.0.1:5000/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({input : inputValue})
      })

      const data = await res.json()
      console.log('API response: ', data)
      setResponse(data)
    } catch (err) {
      console.error('Error from flask API:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
      {!isLoading && !response && (
        <>
        <h1 className="text-4xl font-bold text-blue-600">What do you want to master!?</h1>
      <h2 className='text-lg font-semibold'>Enter a skill name and description to generate your skill tree</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-xl'>
        <textarea
          rows={1}
          placeholder="Type here and press Enter..."
          className="border rounded-xl px-4 py-2 resize-none max-h-48 overflow-auto focus:outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
        />
        <button 
          type='submit'
          className='self-end bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-xl'
          >
            generate
        </button>
      </form>
      </>
      )}

      {isLoading && (
        <div className='flex flex-col items-center'>
          <div className='text-2xl font-semibold text-grey-600'>Generating...</div>
          <div className='mt-6 w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin'></div>
        </div>
      )}

      {response && (
          <SkillTreePage skillData = {response}/>
      )}
    </div>
  )
}


export default App