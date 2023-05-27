On-demand Taskrabbit-like Application

Build an on-demand service app where users can post jobs they need done and workers can accept the jobs. Includes user profiles, job listings, job status tracking, and messaging via email. Features include sorting jobs, ratings of service providers, and front-end dashboards for users posting jobs and users looking for jobs.

What tech stack will you use for your final project? 
- React & Node. Using third party APIs for image/video storage, email, 2FA, and credit card processing.

Is the front-end UI or the back-end going to be the focus of your project? Or are you going to make an evenly focused full-stack application? 
- Evenly focused

Will this be a website? A mobile app? Something else? 
- Website

What goal will your project be designed to achieve? 
- Help users find help with personal projects they do not have time for or are not skilled enough to complete

What kind of users will visit your app? In other words, what is the demographic of your users? 
- Homeowners, but can be beneficial to anyone

What data do you plan on using? How are you planning on collecting your data? 
- Creating my own API and populating the database with example data for the application. Utilizing third-party API’s for email, two-factor authentication, credit card processing, and image/video storage

In brief, outline your approach to creating your project (knowing that you may not know everything in advance and that these details might change later). Answer questions like the ones below, but feel free to add more information: 

a.What does your database schema look like? 
- (will use a database schema tool to visualize)
    1. Users - basic profile information for those who will be posting jobs, reviews, and messages
    2. Workers - basic profile information for those who will be accepting jobs, reviews, and messages
    3. Messages - messages between users and workers
    4. user_messages - link table for messages between users/workers
    5. Reviews - user posted text reviews and “star” ratings
    6. user_reviews - link table for users and their reviews
    7. worker_reviews - link table for workers and their received reviews
    8. Jobs - job information, such as, description of work, location, provided tools
    9. Transactions - payments made to workers by users
    10. user_worker_transactions - link table for users and their transactions to workers
    10. user_worker_jobs - link table for user posted jobs and the worker who accepted job

b.What kinds of issues might you run into with your API?
- General implementation issues dependent on quality and clarity of API docs.

c.Is there any sensitive information you need to secure? 
- User password and location.

d.What functionality will your app include?
- 
    1. Uploading of images and videos
    2. Asynchronous messaging
    3. Email notifications
    4. Two-factor authentication
    5. Job status tracking
    6. Job sorting
    7. Reviews
    8. Payments

e.What will the user flow look like?
- 
    1. User posts job with images and description
    2. Worker opens job description and accepts
    3. User is alerted via email and visually in-app when worker accepts job
    4. User and worker can message one another
    5. Worker submits video/image of completed work
    6. User verifies work is complete after reviewing
    7. User leaves review for worker

f.What features make your site more than a CRUD app? What are your stretch goals?
- Two-factor authentication, email notifications, and credit card processing integration make my app more than a CRUD app. 
- My stretch goals are as follows:
   1. Analytics - track how users are interacting with the app
   2. Log management system - monitoring of the app in production for errors