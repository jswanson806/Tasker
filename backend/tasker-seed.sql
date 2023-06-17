-- Fake user data -- all test users have the password "password"
INSERT INTO "users" ("id", "password", "phone", "first_name", "last_name", "email", "is_worker", "is_admin")
VALUES
  (1, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '1234567890', 
  'Ted', 
  'Lasso', 
  'user1@example.com', 
  false,
  false),
  (2, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '9876543210', 
  'Coach', 
  'Beard', 
  'user2@example.com', 
  true,
  false),
  (3, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '4444444444', 
  'Jamie', 
  'Tartt', 
  'user3@example.com', 
  true,
  false),
  (4, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '5555555555', 
  'Roy', 
  'Kent', 
  'user4@example.com', 
  false,
  true),
  (5, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '9999999999', 
  'Rebecca', 
  'Welton', 
  'user5@example.com', 
  false,
  true),
  (6, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '1111111111', 
  'Nathan', 
  'Shelley', 
  'user6@example.com', 
  true,
  false),
  (7, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '2222222222', 
  'Keeley', 
  'Jones', 
  'user7@example.com', 
  false,
  false),
  (8, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '3333333333', 
  'Sam', 
  'Obisanya', 
  'user8@example.com', 
  true,
  false),
  (9, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '8888888888', 
  'Higgins', 
  'Hunt', 
  'user9@example.com', 
  true,
  true),
  (10, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '2222222222', 
  'AFC', 
  'Richmond', 
  'user10@example.com', 
  false,
  false),
  (11, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '7772228888', 
  'Kenny', 
  'McDonald', 
  'user11@example.com', 
  true,
  false),
  (12, 
  '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 
  '3338885555', 
  'Colin', 
  'Hues', 
  'user12@example.com', 
  false,
  false);

-- Fake job data
INSERT INTO "jobs" ("id", "title", "body", "status", "address", "posted_by", "assigned_to", "start_time", "end_time", "payment_due", "before_image_url", "after_image_url")
VALUES
  (1, 'Gardening', 'Need help with gardening tasks', 'posted', '123 Main St', 4, NULL, NULL, NULL, NULL, '', ''),
  (2, 'House Cleaning', 'Cleaning required for a 3-bedroom house', 'accepted', '456 Elm St', 1, 3, '2023-06-01 09:00:00', NULL, NULL, '', ''),
  (3, 'Painting', 'Interior painting for a small apartment', 'complete', '789 Oak St', 7, 3, '2023-06-02 10:00:00', '2023-06-02 15:00:00', 125, '', ''),
  (4, 'Dog Walking', 'Need someone to walk my dog twice a day', 'posted', '321 Maple Ave', 10, NULL, NULL, NULL, NULL, '', ''),
  (5, 'Furniture Assembly', 'Assembly required for new furniture', 'pending review', '987 Pine St', 12, 4, '2023-06-03 14:00:00', '2023-06-03 17:00:00', 75, '', ''),
  (6, 'Plumbing Repair', 'Fix a leaky faucet in the kitchen', 'accepted', '567 Walnut St', 1, 3, '2023-06-04 11:00:00', '2023-06-04 12:30:00', NULL, '', ''),
  (7, 'Lawn Mowing', 'Mow the lawn and trim the hedges', 'complete', '234 Oakwood Dr', 5, 6, '2023-06-05 09:00:00', '2023-06-05 11:00:00', 50, '', ''),
  (8, 'House Painting', 'Exterior painting for a two-story house', 'accepted', '456 Birch Ln', 12, 11, '2023-06-06 08:00:00', NULL, NULL, '', ''),
  (9, 'Electrical Repair', 'Fix a faulty electrical outlet in the living room', 'posted', '789 Cedar Rd', 4, NULL, NULL, NULL, NULL, '', ''),
  (10, 'Moving Assistance', 'Help with packing and moving furniture', 'pending review', '123 Elmwood Ave', 1, 3, '2023-06-07 10:00:00', '2023-06-07 14:00:00', 80, '', ''),
  (11, 'Carpet Cleaning', 'Deep cleaning for carpets in a large office space', 'posted', '567 Willow Way', 10, NULL, NULL, NULL, NULL, '', ''),
  (12, 'Appliance Installation', 'Install a new dishwasher in the kitchen', 'accepted', '890 Pinecone Rd', 7, 11, '2023-06-08 13:00:00', NULL, NULL, '', '');

-- Fake review data
INSERT INTO "reviews" ("id", "title", "body", "stars", "reviewed_by", "reviewed_for")
VALUES
  (1, 'Great Job!', 'The worker did an excellent job.', 5, 1, 2),
  (2, 'Punctual and Professional', 'The worker arrived on time and was very professional.', 4, 4, 3),
  (3, 'Average Service', 'The service provided was average.', 3, 4, 6),
  (4, 'Highly Recommended!', 'I would highly recommend this worker. They exceeded my expectations.', 5, 7, 3),
  (5, 'Good Service', 'The service provided was good. The worker was polite and efficient.', 4, 5, 9),
  (6, 'Could be Better', 'There is room for improvement. The worker needs to pay more attention to detail.', 2, 4, 11),
  (7, 'Exceptional Work!', 'The worker went above and beyond. I am extremely satisfied with their service.', 5, 10, 6),
  (8, 'Average Performance', 'The worker did an average job. There were no major issues, but nothing exceptional either.', 3, 4, 8),
  (9, 'Not Recommended', 'I had a negative experience with this worker. I would not recommend their services.', 1, 12, 9);

-- Fake conversation data
INSERT INTO "conversations" ("id", "created_at")
VALUES 
  ('u1u2', '2023-06-03 10:00:00'),
  ('u1u3', '2023-06-05 09:30:00');

-- Fake message data
INSERT INTO "messages" ("id", "body", "conversation_id", "sent_by", "sent_to", "created_at")
VALUES
  (1, 'Hi, I''m interested in your job posting.', 'u1u2', 2, 1, '2023-06-03 10:00:00'),
  (2, 'Sure, I can help you with that.', 'u1u2', 1, 2, '2023-06-03 11:00:00'),
  (3, 'When do you need the job to be done?', 'u1u2', 2, 1, '2023-06-04 15:30:00'),
  (4, 'I can start the job next week. Is that fine?', 'u1u2', 2, 1, '2023-06-04 16:00:00'),
  (5, 'I have some previous experience in similar tasks.', 'u1u3', 3, 1, '2023-06-05 09:30:00'),
  (6, 'Can you provide the necessary tools for the job?', 'u1u3', 3, 1, '2023-06-05 10:00:00'),
  (7, 'Yes, I can provide the necessary tools.', 'u1u3', 1, 3, '2023-06-05 10:30:00'),
  (8, 'That is great! Thank you.', 'u1u2', 1, 2, '2023-06-05 11:00:00'),
  (9, 'By the way, do you have any specific preferences for the job?', 'u1u2', 2, 1, '2023-06-05 12:30:00'),
  (10, 'I prefer using eco-friendly cleaning products.', 'u1u2', 1, 2, '2023-06-05 13:00:00'),
  (11, 'Noted. I will make sure to use eco-friendly products.', 'u1u2', 2, 1, '2023-06-05 14:30:00'),
  (12, 'That sounds good. Looking forward to working with you!', 'u1u3', 3, 1, '2023-06-05 15:00:00');

-- Fake application data
INSERT INTO "applications" ("id", "applied_by", "applied_to")
VALUES
  (1, 2, 1),
  (2, 3, 9),
  (3, 3, 4),
  (4, 3, 11),
  (5, 6, 11),
  (6, 6, 1),
  (7, 6, 4),
  (8, 8, 11),
  (9, 8, 9),
  (10, 8, 4);

-- Fake payout data
INSERT INTO "payouts" ("id", "trans_to", "trans_by", "subtotal", "tax", "tip", "total", "created_at")
VALUES
  (1, 1, 3, 375.00, 30.00, 30.00, 435.00, '2023-05-15 10:00:00'),
  (2, 5, 6, 375.00, 30.00, 30.00, 435.00, '2023-05-15 10:00:00'),
  (3, 7, 3, 375.00, 30.00, 30.00, 435.00, '2023-05-31 10:00:00');