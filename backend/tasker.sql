-- terminal prompts for main database
\echo 'Delete and recreate tasker db?'
\prompt 'Return for yes or control-C to cancel > ' foo
-- drop, create, connect commands for main database
DROP DATABASE tasker;
CREATE DATABASE tasker;
\connect tasker

\i tasker-schema.sql
\i tasker-seed.sql

-- terminal prompts for test database
\echo 'Delete and recreate tasker_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo
-- drop, create, connect commands for test database
DROP DATABASE tasker_test;
CREATE DATABASE tasker_test;
\connect tasker_test

\i tasker-schema.sql