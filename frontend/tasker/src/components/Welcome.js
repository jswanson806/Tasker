import React from 'react';

const Welcome = () => {
    return(
        <div>
            <h1>Welcome to Tasker!</h1>
            <p>Tasker is your personal marketplace for finding help to get things done. Sign up to post your open jobs or register as a Worker to get hired today!</p>
            <p>New here?</p>
            <a href='/signup'>Sign Up</a>
            <br></br>
            <p>Already registered?</p>
            <a href='/login'>Login</a>
        </div>
    );
}

export default Welcome;