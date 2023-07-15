import React from "react";

const Dashboard = () => {
    return(
        <div className="dashboard-container">
            <h1 className="dashboard-title">Tasker Dashboard</h1>
            <div className="dashboard-card">
                <div className="dashboard-jobs">
                    <a href="/jobs">Jobs</a>
                </div>
                <br></br>
                <div className="dashboard-reviews">
                    <a href="/reviews">Reviews</a>
                </div>
                <br></br>
                <div className="dashboard-messages">
                    <a href="/messages">Messages</a>
                </div>
                <br></br>
                <div className="dashboard-account">
                    <a href="/account">Account</a>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;