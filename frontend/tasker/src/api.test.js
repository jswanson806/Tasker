import TaskerApi from './api';

describe('TaskerApi', () => {

  describe('auth tests', () => {

    afterEach(() => {
      // Restore the original implementation of TaskerApi.request
      jest.restoreAllMocks();
    });

    it('should return the token', async () => {

      const responseData = { token: 'dummyToken' };
      const userInfo = {
        email: 'email@email.com',
        first_name: 'Testy',
        last_name: 'McTesty',
        is_worker: false,
        is_admin: false,
        phone: '4444444444'
      }

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const token = await TaskerApi.registerUser(userInfo);

      expect(token).toEqual('dummyToken');
    });

  });

    it('should return the token', async () => {

      const responseData = { token: 'dummyToken' };

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const token = await TaskerApi.login();

      expect(token).toEqual(responseData);
    });

  describe('user tests', () => {

    afterEach(() => {
      // Restore the original implementation of TaskerApi.request
      jest.restoreAllMocks();
    });

    it('should return the users', async () => {

      const responseData = { allUsers: 
        [{ 
          id: 1, 
          email: "email@email.com", 
          firstName: "Testy", 
          lastName: "McTesty", 
          phone: "4444444444",
          isWorker: false, 
          isAdmin: false 
        }]};

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.getAllUsers();

      expect(res).toEqual({ allUsers: 
        [{ 
          id: 1, 
          email: "email@email.com", 
          firstName: "Testy", 
          lastName: "McTesty", 
          phone: "4444444444",
          isWorker: false, 
          isAdmin: false 
        }]});
    });

    it('should return the user', async () => {

      const responseData = { user: 
        { 
          id: 1, 
          email: "email@email.com", 
          firstName: "Testy", 
          lastName: "McTesty", 
          phone: "4444444444",
          isWorker: false, 
          isAdmin: false 
        }};

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.getSingleUser(1);

      expect(res).toEqual({ user: 
        { 
          id: 1, 
          email: "email@email.com", 
          firstName: "Testy", 
          lastName: "McTesty", 
          phone: "4444444444",
          isWorker: false, 
          isAdmin: false 
        }});
    });

    it('should return message about applied job', async () => {

      const responseData = { Message: `User 1 applied to job 1` };

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.applyToJob();

      expect(res).toEqual({ Message: `User 1 applied to job 1` });
    });

    it('should return message about updated user', async () => {

      const responseData = { Message: `Updated user 1: {email, first_name, last_name, phone, is_worker}` };

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.updateSingleUser(1);

      expect(res).toEqual({ Message: `Updated user 1: {email, first_name, last_name, phone, is_worker}` });
    });

    it('should return message about deleted user', async () => {

      const responseData = { Message: `User 1 has been removed` };

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.deleteSingleUser(1);

      expect(res).toEqual({ Message: `User 1 has been removed` });
    });

  });

  describe('jobs tests', () => {

    afterEach(() => {
      // Restore the original implementation of TaskerApi.request
      jest.restoreAllMocks();
    });

    it('should return array of all jobs', async () => {
      const responseData = { allJobs: [
        {
          id: 1, 
          title: 'test job', 
          body: 'this is a test job', 
          status: 'pending', 
          address: '181 N Costline Drive', 
          postedBy: 1, 
          assignedTo: 2, 
          startTime: null, 
          endTime: null, 
          paymentDue: null, 
          beforeImage: 'http://testimg.com', 
          afterImage: null
        }
      ]};

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.findAllAvailableJobs();

      expect(res).toEqual({ allJobs: [
        {
          id: 1, 
          title: 'test job', 
          body: 'this is a test job', 
          status: 'pending', 
          address: '181 N Costline Drive', 
          postedBy: 1, 
          assignedTo: 2, 
          startTime: null, 
          endTime: null, 
          paymentDue: null, 
          beforeImage: 'http://testimg.com', 
          afterImage: null
        }
      ]});
    })

    it('should return single job', async () => {
      const responseData = { job: {
        id: 1, 
        title: 'test job', 
        body: 'this is a test job', 
        status: 'pending', 
        address: '181 N Coastline Drive', 
        postedBy: 1, 
        assignedTo: 2, 
        startTime: null, 
        endTime: null, 
        paymentDue: null, 
        beforeImage: 'http://testimg.com', 
        afterImage: null
      }};

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.getSingleJob(1);

      expect(res).toEqual({ job: {
        id: 1, 
        title: 'test job', 
        body: 'this is a test job', 
        status: 'pending', 
        address: '181 N Coastline Drive', 
        postedBy: 1, 
        assignedTo: 2, 
        startTime: null, 
        endTime: null, 
        paymentDue: null, 
        beforeImage: 'http://testimg.com', 
        afterImage: null
      }});
    });

    it('should return message about created job', async () => {
      const responseData = { Message: `Created new job with id: 1` }

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.createJob();

      expect(res).toEqual({ Message: `Created new job with id: 1` });
    });

    it('should return message about updated job', async () => {
      const responseData = { Message: `Updated job: {title: 'test job', body: 'this is a test', status: 'accepted', address: '181 N Coastline Drive'}`}

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.updateSingleJob({job: {id: 1}});

      expect(res).toEqual({ Message: `Updated job: {title: 'test job', body: 'this is a test', status: 'accepted', address: '181 N Coastline Drive'}`});
    });

    it('should return message about removing job', async () => {
      const responseData = { Message: `Job 1 has been removed`}

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.deleteSingleJob(1);

      expect(res).toEqual({ Message: `Job 1 has been removed`});
    });
    
  });

  describe('messages tests', () => {

    afterEach(() => {
      // Restore the original implementation of TaskerApi.request
      jest.restoreAllMocks();
    });

    it('should return array of messages', async () => {
      const responseData = [{
        id: 1, 
        body: 'message', 
        conversation_id: 'u1u2', 
        sent_by: 1, 
        sent_to: 2, 
        created_at: '7/14/2023 9:00:00 AM'
      }]

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.getConversationBetween(1, 2);

      expect(res).toEqual([{
        id: 1, 
        body: 'message', 
        conversation_id: 'u1u2', 
        sent_by: 1, 
        sent_to: 2, 
        created_at: '7/14/2023 9:00:00 AM'
      }]);

    });

    it('should return created message', async () => {
      const responseData = [{
        body: 'message', 
        conversation_id: 'u1u2', 
        sent_by: 1, 
        sent_to: 2, 
        created_at: '7/14/2023 9:00:00 AM'
      }]

      // Mock the TaskerApi.request method
      const requestSpy = jest.spyOn(TaskerApi, 'request');
      requestSpy.mockResolvedValue(responseData);

      const res = await TaskerApi.createMessage();

      expect(res).toEqual([{
        body: 'message', 
        conversation_id: 'u1u2', 
        sent_by: 1, 
        sent_to: 2, 
        created_at: '7/14/2023 9:00:00 AM'
      }]);
      
    });
      
  });

});
