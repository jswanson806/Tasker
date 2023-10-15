# Tasker

### Description:
Tasker is an online marketplace where you can register as a user to post jobs and hire workers or register as a worker to accept and work jobs. Users post jobs and include a "before" image. Users can assign a specific worker from a list of those who have applied to work their job. The worker assigned will receive an automatic message with the address of that job. Once assigned, the worker can message back-and-forth with the user who created the job. Once the worker completes the job, they upload an "after" image. Once the user who created the job has reviewed the work done by the worker, they will pay the user via a pre-made Stripe checkout page.

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

