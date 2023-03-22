create table auth_user
(
    id         uuid      default gen_random_uuid() not null
        constraint auth_user_pk
            primary key,
    email      varchar(100)                        not null
        constraint auth_user_pk2
            unique,
    password   text                                not null,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null
);

alter table auth_user
    owner to luislira;

create table role
(
    id         uuid      default gen_random_uuid() not null
        constraint role_pk
            primary key,
    name       varchar(20)                         not null
        constraint role_pk2
            unique,
    is_admin   boolean   default false             not null,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null
);

alter table role
    owner to luislira;

create table user_profile
(
    id           uuid      default gen_random_uuid() not null
        constraint user_profile_pk
            primary key,
    auth_user_id uuid                                not null
        constraint user_profile_pk3
            unique
        constraint user_profile_auth_user_id_fk
            references auth_user
            on delete cascade,
    name         varchar(100)                        not null,
    username     varchar(100)                        not null
        constraint user_profile_pk2
            unique,
    created_at   timestamp default now()             not null,
    updated_at   timestamp default now()             not null,
    role_id      uuid                                not null
        constraint user_profile_role_id_fk
            references role
);

alter table user_profile
    owner to luislira;

create table tag
(
    id         uuid      default gen_random_uuid() not null
        constraint tag_pk
            primary key,
    name       varchar(30)                         not null
        constraint tag_pk2
            unique,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null
);

alter table tag
    owner to luislira;

create table challenge
(
    id              uuid      default gen_random_uuid() not null
        constraint challenge_pk
            primary key,
    title           varchar(100)                        not null,
    description     text                                not null,
    user_profile_id uuid                                not null
        constraint challenge_user_profile_id_fk
            references user_profile
            on delete cascade,
    created_at      timestamp default now()             not null,
    updated_at      timestamp default now()             not null
);

alter table challenge
    owner to luislira;

create table tag_challenge
(
    id           uuid default gen_random_uuid() not null
        constraint tag_challenge_pk
            primary key,
    tag_id       uuid                           not null
        constraint tag_challenge___fk
            references tag
            on delete cascade,
    challenge_id uuid
        constraint tag_challenge_challenge_id_fk
            references challenge
            on delete cascade
);

alter table tag_challenge
    owner to luislira;

create table solution
(
    id              uuid      default gen_random_uuid() not null
        constraint solution_pk
            primary key,
    description     text                                not null,
    url             text                                not null,
    user_profile_id uuid                                not null
        constraint solution_user_profile_id_fk
            references user_profile
            on delete cascade,
    challenge_id    uuid
        constraint solution_challenge_id_fk
            references challenge
            on delete set null,
    created_at      timestamp default now()             not null,
    updated_at      timestamp default now()             not null
);

alter table solution
    owner to luislira;

create table comment
(
    id              uuid      default gen_random_uuid() not null
        constraint comment_pk
            primary key,
    content         text                                not null,
    user_profile_id uuid                                not null
        constraint comment_user_profile_id_fk
            references user_profile,
    solution_id     uuid                                not null
        constraint comment_solution_id_fk
            references solution,
    created_at      timestamp default now()             not null,
    updated_at      timestamp default now()             not null
);

alter table comment
    owner to luislira;

create function pg_last_wal_replay_tli_lsn() returns setof table("tli" integer, "lsn" pg_lsn)
    strict
    language c
as
$$
begin
-- missing source code
end;

$$;

alter function pg_last_wal_replay_tli_lsn() owner to azuresu;

create function pg_crash() returns void
    strict
    language c
as
$$
begin
-- missing source code
end;
$$;

alter function pg_crash() owner to azuresu;

create function azure_roles_authtype() returns setof table("rolename" char, "authtype" text)
    strict
    language c
as
$$
begin
-- missing source code
end;

$$;

alter function azure_roles_authtype() owner to azuresu;

create function trigger_set_timestamp() returns trigger
    language plpgsql
as
$$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$;

alter function trigger_set_timestamp() owner to luislira;

create trigger auth_user_update
    before update
    on auth_user
    for each row
    execute procedure trigger_set_timestamp();

create trigger user_profile_update
    before update
    on user_profile
    for each row
    execute procedure trigger_set_timestamp();

create trigger role_update
    before update
    on role
    for each row
    execute procedure trigger_set_timestamp();

create trigger tag_update
    before update
    on tag
    for each row
    execute procedure trigger_set_timestamp();

create trigger challenge_update
    before update
    on challenge
    for each row
    execute procedure trigger_set_timestamp();

create trigger solution_update
    before update
    on solution
    for each row
    execute procedure trigger_set_timestamp();

create trigger comment_update
    before update
    on comment
    for each row
    execute procedure trigger_set_timestamp();

