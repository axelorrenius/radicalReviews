import React, { useState } from 'react'

function Login(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  
    function handleLogin2(e) {
        e.preventDefault()
        // Code to handle login goes here
    }
  
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Login</h2>
                <form onSubmit={handleLogin2}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <button type="submit">Login</button>
                </form>
                <button onClick={props.toggle}>Close</button>
            </div>
        </div>
    )
  }

export default Login