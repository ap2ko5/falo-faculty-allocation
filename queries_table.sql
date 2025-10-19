
-- Add this to your Supabase SQL Editor:

CREATE TABLE queries (
  id serial primary key,
  faculty_id integer references faculty(id),
  faculty_name varchar,
  subject varchar,
  message text,
  status varchar default 'pending',
  created_at timestamp default now()
);
