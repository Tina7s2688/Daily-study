-- 第 6 步：作答進度表。每個使用者一列，整份進度存成 JSON。
create table progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,                 -- 整份進度（做過哪些題組、SQL 過了哪幾關…）
  updated_at timestamptz not null default now()
);

-- RLS 規則：每個人只能讀、新增、修改「user_id 是自己」的那一列
create policy "read own progress"
  on progress for select to authenticated
  using (auth.uid() = user_id);

create policy "insert own progress"
  on progress for insert to authenticated
  with check (auth.uid() = user_id);

create policy "update own progress"
  on progress for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
