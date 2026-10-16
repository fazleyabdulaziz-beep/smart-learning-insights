-- Smart Learning Insights 2.0 — run in Supabase: SQL Editor > New query > Run
create table profiles (id uuid primary key references auth.users on delete cascade, display_name text not null, role text not null check (role in ('parent','teacher','student')));
create table students (id uuid primary key default gen_random_uuid(), display_name text not null, grade int not null check (grade between 1 and 3), avatar text default '🙂', created_at timestamptz default now());
create table student_links (user_id uuid references auth.users on delete cascade, student_id uuid references students on delete cascade, relationship_type text not null, class_id text, primary key (user_id, student_id));
create table attempts (id uuid primary key default gen_random_uuid(), student_id uuid not null references students on delete cascade, subject_id text not null, skill_id text, attempt_type text not null check (attempt_type in ('assessment','practice')), completed_at timestamptz default now());
create table responses (id uuid primary key default gen_random_uuid(), attempt_id uuid not null references attempts on delete cascade, question_id text not null, selected_answer text not null, is_correct boolean not null);

create function can_access(sid uuid) returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from student_links where user_id = auth.uid() and student_id = sid) $$;
grant execute on function can_access(uuid) to authenticated;

alter table profiles enable row level security; alter table students enable row level security; alter table student_links enable row level security;
alter table attempts enable row level security; alter table responses enable row level security;

create policy "own profile" on profiles for select to authenticated using (id = auth.uid());
create policy "own links" on student_links for select to authenticated using (user_id = auth.uid());
create policy "read linked students" on students for select to authenticated using (can_access(id));
create policy "edit linked students" on students for update to authenticated using (can_access(id)) with check (can_access(id));
create policy "read attempts" on attempts for select to authenticated using (can_access(student_id));
create policy "add attempts" on attempts for insert to authenticated with check (can_access(student_id));
create policy "read responses" on responses for select to authenticated using (exists (select 1 from attempts a where a.id = attempt_id and can_access(a.student_id)));
create policy "add responses" on responses for insert to authenticated with check (exists (select 1 from attempts a where a.id = attempt_id and can_access(a.student_id)));

-- DEMO SEED (fictional only). 1) Authentication > Users > Add user (parent, teacher, student).
-- 2) Replace the UUIDs below with those users' ids, then run this part.
-- insert into profiles values ('PARENT-UUID','Puan Rohana','parent'),('TEACHER-UUID','Cikgu Faridah','teacher'),('STUDENT-UUID','Aisyah','student');
-- with s as (insert into students (display_name, grade, avatar) values ('Aisyah',2,'🦋'),('Hafiz',3,'🚀') returning id, display_name)
-- insert into student_links select 'PARENT-UUID', id, 'parent', null from s;
-- insert into student_links select 'TEACHER-UUID', id, 'teacher', 'c1' from s;
-- insert into student_links select 'STUDENT-UUID', id, 'self', null from s where display_name = 'Aisyah';
