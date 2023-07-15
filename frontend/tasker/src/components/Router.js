import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from '../components/Welcome.js';
import Dashboard from '../components/Dashboard.js';
import Login from '../components/Login.js';
import SignUp from '../components/SignUp.js';
import CreateJob from '../components/CreateJob.js';
import CreateReview from '../components/CreateReview.js';
import Reviews from '../components/Reviews.js';
import Jobs from '../components/Jobs.js';
import Messages from '../components/Messages.js';
import Account from '../components/Account.js';
import NotFound from '../components/NotFound.js';

const Router = () => {
    return(
        <main>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/create-job" element={<CreateJob />} />
                <Route path="/create-review" element={<CreateReview />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/account" element={<Account />} />

                {/* default catch all redirect to 404 page */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </main>
    );
}

export default Router;