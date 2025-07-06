import logo from './assets/logo.png'
import { useState } from 'react'

function App() {
  const [inputValue, setInputValue ] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', inputValue)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-5xl font-bold text-blue-600 text-center">What do you want to master!?</h1>
      <h2 className='text-lg font-bold'>enter the skill name with describtion then we will generate the skill tree for you</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
        <textarea
          rows={1}
          placeholder="Type here and press Enter..."
          className="border rounded-xl w-100 px-4 py-2 resize-none max-h-48 overflow-auto focus:outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
        />
        <button 
          type='submit'
          className='bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-xl'
          >
            Enter
        </button>
      </form>
    </div>
  )
}


export default App
