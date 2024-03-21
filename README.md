# Tasker

### Link to Hosted Application
## [Tasker](https://tasker-market.surge.sh)

### Description:
Tasker is an online marketplace where you can register as a "user" to post jobs and hire workers or register as a "worker" to apply for jobs. Users post jobs and include a "before" image. Users can assign a specific worker from a list of those who have applied to work their job. The worker assigned will receive an automatic message with the address of that job. Once assigned, the worker can message back-and-forth with the user who created the job. Once the worker completes the job, they upload an "after" image. Once the user who created the job has reviewed the work done by the worker, they will pay the user via a pre-made Stripe checkout page.

### Explore the App
Demo **User** Login:  
`user@demo.com`  
Demo User Password:  
`D3monstr@tion`  

Demo **Worker** Login:  
`worker@demo.com`  
Demo Worker Password:  
`D3monstr@tion`  

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

### My Experience With This Project
This was my first experience building a full-stack application from scratch and I learned so much. It quickly became clear that the scope of the project was much bigger than my original intention, and that was exciting! Before this project, my experience with React was limited. This project gave me the opportunity to strengthen my React skills while simultanesouly making me a better backend developer. 

The most challenging part of this project was creating two sides of the same application that would be used by "workers" and "users." Ensuring the logic was structured and abstracted in a way that made sense was a delightful puzzle.

### How Would I Improve Upon This Project
- Adding reviews where "users" review the "workers" who complete their jobs
- Users would be able to view the "workers" review history before assigning them to the job to which they applied
- Account management dashboards where "users" and "workers" can view payment history and change account details
- Email notifications for things like new messages, accepted applications, new applications, etc...

### Application Flowchart
![Flow Chart](https://drive.google.com/uc?export=view&id=154CtWaYhWIYFQzD7j3bw5R7sZd44M_tC)

### Database Schema
![database schema](https://drive.google.com/uc?export=view&id=1S2EHJJf4Hzg4lNCcppD5SsCHT4Aojfj3)
