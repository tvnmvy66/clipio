import React from 'react'

function Navbar() {
  return (
    <div className="flex justify-center items-center h-[6.5vh] bg-slate-900">
      <div className=" flex justify-between w-[70vw]">
        <span className="text-white font-mono text-l">ClipIO</span>
        <span className="text-slate-800 bg-white px-2 text-l rounded font-mono">
            <button>Login</button> 
        </span>
      </div>
    </div>
  )
}

export default Navbar
