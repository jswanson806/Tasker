import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TokenContext } from '../helpers/TokenContext.js';
import Welcome from '../components/Welcome.js';
import Dashboard from '../components/Dashboard.js';
import Login from '../components/Login.js';
import SignUp from '../components/SignUp.js';
import CreateJob from '../components/CreateJob.js';
import CreateReview from '../components/CreateReview.js';
import Reviews from '../components/Reviews.js';
import Jobs from '../components/Jobs.js';
import Messages from '../components/Messages.js';
import NotFound from '../components/NotFound.js';
import Account from '../components/Account.js';

const Router = () => {

    const { token } = useContext(TokenContext);

    const loggedIn = (token && token !== '') ? true : false;

    return(
        <main>
            <Routes>
                <Route path="/" element={loggedIn ? <Navigate to="/dashboard"/> : <Welcome />} />
                <Route path="/dashboard" element={!loggedIn ? <Navigate to="/"/> : <Dashboard />} />
                <Route path="/login" element={loggedIn ? <Navigate to="/dashboard"/> : <Login />} />
                <Route path="/signup" element={loggedIn ? <Navigate to="/dashboard"/> : <SignUp />} />
                <Route path="/create-job" element={!loggedIn ? <Navigate to="/"/> : <CreateJob />} />
                <Route path="/create-review" element={!loggedIn ? <Navigate to="/"/> : <CreateReview />} />
                <Route path="/reviews" element={!loggedIn ? <Navigate to="/"/> : <Reviews />} />
                <Route path="/jobs" element={!loggedIn ? <Navigate to="/"/> : <Jobs />} />
                <Route path="/messages" element={!loggedIn ? <Navigate to="/"/> : <Messages />} />
                <Route path="/account" element={!loggedIn ? <Navigate to="/"/> : <Account />} />

                {/* default catch all redirect to 404 page */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </main>
    );
}

export default Router;