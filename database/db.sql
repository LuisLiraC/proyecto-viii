create table public.auth_user
(
    id         uuid      default gen_random_uuid() not null
        constraint auth_user_pk
            primary key,
    email      char(100)                           not null
        constraint auth_user_pk2
            unique,
    password   text                                not null,
    created_at timestamp default now(),
    updated_at timestamp default now()             not null
);

alter table public.auth_user
    owner to luislira;

create trigger auth_user_update
    before update
    on public.auth_user
    for each row
    execute procedure public.trigger_set_timestamp();

create table public.role
(
    id         uuid      default gen_random_uuid() not null
        constraint role_pk
            primary key,
    name       char(20)                            not null
        constraint role_pk2
            unique,
    is_admin   boolean   default false             not null,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null
);

alter table public.role
    owner to luislira;

create table public.user_profile
(
    id           uuid      default gen_random_uuid() not null
        constraint user_profile_pk
            primary key,
    auth_user_id uuid                                not null
        constraint user_profile_pk3
            unique
        constraint user_profile_auth_user_id_fk
            references public.auth_user,
    name         char(200)                           not null,
    username     char(100)                           not null
        constraint user_profile_pk2
            unique,
    created_at   timestamp default now(),
    updated_at   timestamp default now(),
    role_id      uuid                                not null
        constraint user_profile_role_id_fk
            references public.role
);

alter table public.user_profile
    owner to luislira;

create trigger user_profile_update
    before update
    on public.user_profile
    for each row
    execute procedure public.trigger_set_timestamp();

create trigger role_update
    before update
    on public.role
    for each row
    execute procedure public.trigger_set_timestamp();

create table public.tag
(
    id         uuid      default gen_random_uuid() not null
        constraint tag_pk
            primary key,
    name       char(30)                            not null
        constraint tag_pk2
            unique,
    created_at timestamp default now()             not null,
    updated_at timestamp default now()             not null
);

alter table public.tag
    owner to luislira;

create trigger tag_update
    before update
    on public.tag
    for each row
    execute procedure public.trigger_set_timestamp();

create table public.challenge
(
    id              uuid      default gen_random_uuid() not null
        constraint challenge_pk
            primary key,
    title           char(100)                           not null,
    description     text                                not null,
    user_profile_id uuid                                not null
        constraint challenge_user_profile_id_fk
            references public.user_profile,
    created_at      timestamp default now()             not null,
    updated_at      timestamp default now()             not null
);

alter table public.challenge
    owner to luislira;

create trigger challenge_update
    before update
    on public.challenge
    for each row
    execute procedure public.trigger_set_timestamp();

create table public.tag_challenge
(
    id           uuid default gen_random_uuid() not null
        constraint tag_challenge_pk
            primary key,
    tag_id       uuid                           not null
        constraint tag_challenge___fk
            references public.tag,
    challenge_id uuid
        constraint tag_challenge_challenge_id_fk
            references public.challenge
);

alter table public.tag_challenge
    owner to luislira;

create table public.solution
(
    id              uuid      default gen_random_uuid() not null
        constraint solution_pk
            primary key,
    description     text                                not null,
    url             text                                not null,
    user_profile_id uuid                                not null
        constraint solution_user_profile_id_fk
            references public.user_profile,
    challenge_id    uuid                                not null
        constraint solution_challenge_id_fk
            references public.challenge,
    created_at      timestamp default now()             not null,
    updated_at      timestamp default now()             not null
);

alter table public.solution
    owner to luislira;

create trigger solution_update
    before update
    on public.solution
    for each row
    execute procedure public.trigger_set_timestamp();

create table public.comment
(
    id              uuid      default gen_random_uuid() not null
        constraint comment_pk
            primary key,
    content         text                                not null,
    user_profile_id uuid                                not null
        constraint comment_user_profile_id_fk
            references public.user_profile,
    solution_id     uuid                                not null
        constraint comment_solution_id_fk
            references public.solution,
    created_at      timestamp default now()             not null,
    updated_at      timestamp default now()             not null
);

alter table public.comment
    owner to luislira;

create trigger comment_update
    before update
    on public.comment
    for each row
    execute procedure public.trigger_set_timestamp();

