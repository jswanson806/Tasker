# Capstone_2

### Link to Hosted Application
## [Tasker](https://tasker-market.surge.sh)

### Description:
Tasker is an online marketplace where you can register as a "user" to post jobs and hire workers or register as a "worker" to apply for jobs. Users post jobs and include a "before" image. Users can assign a specific worker from a list of those who have applied to work their job. The worker assigned will receive an automatic message with the address of that job. Once assigned, the worker can message back-and-forth with the user who created the job. Once the worker completes the job, they upload an "after" image. Once the user who created the job has reviewed the work done by the worker, they will pay the user via a pre-made Stripe checkout page.

### Best Way to See How it Works
Since the core functionality of the application relies on asyncronous interactions between registered users and workers, the best way to test the application for yourself is to create two accounts, one as a "user" and one as a "worker."
 - Start with the user account and create a new job with a title you will recognize
 - Login to your worker account and apply to the job you posted from your user account
 - Login to your user account and assign yourself to the job from the list of applicants
 - Login to your worker account and go to "Messages" to view the automatic message that was sent when you were assigned to the job
 - Reply to the message
 - Go to "Jobs" and select "My Jobs"
 - Select the job to begin work, end work, or to message the user directly from the job details
 - Once work is complete, login to your user account and select "Pending Review"
 - Check the before and after images and select "Review" to initiate the payment process

### The Goal 
Create a full-stack replica of the popular application, Task Rabbit

### The Tech Stack
The backend server was created with the following: 
- Express
- Node
- Postgresql

The frontend was created with the following:
- React

API's used:
- Custom API for frontend to communicate with backend
- AWS S3 (image storage) - [AWS S3](https://aws.amazon.com/pm/serv-s3/?trk=fecf68c9-3874-4ae2-a7ed-72b6d19c8034&sc_channel=ps&ef_id=Cj0KCQjwm66pBhDQARIsALIR2zBcUaME3BSaFR5tJblTdI9SVPKhC9IRmTRzI0X1CmUlSgD5QKUFSv8aAk0NEALw_wcB:G:s&s_kwcid=AL!4422!3!536452728638!e!!g!!aws%20s3!11204620052!112938567994)
- Stripe (payments) - [Stripe](https://stripe.com/docs/api)

### Application Flowchart
![Flow Chart](https://drive.google.com/uc?export=view&id=154CtWaYhWIYFQzD7j3bw5R7sZd44M_tC)
