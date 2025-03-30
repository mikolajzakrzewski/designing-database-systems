CREATE TABLE clubs (
    club_id SERIAL PRIMARY KEY,
    club_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs(club_id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rating_point FLOAT
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE user_role (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Competition', 'Training', 'Expedition')),
    participation_cost DECIMAL(10,2)
);

CREATE TABLE event_user (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    participation_type VARCHAR(50) NOT NULL
);

CREATE TABLE competition_results (
    competition_result_id SERIAL PRIMARY KEY,
    event_user_id INT REFERENCES event_user(unique_id) ON DELETE CASCADE,
    points FLOAT NOT NULL,
    placement INT NOT NULL,
    reward DECIMAL(10,2)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    description VARCHAR(1000)
);

CREATE TABLE certificates (
    certificate_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000)
);

CREATE TABLE training (
    training_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    certificate_id INT REFERENCES certificates(certificate_id) ON DELETE CASCADE
);

CREATE TABLE competition (
    competition_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    rank VARCHAR(50),
    reward_pool DECIMAL(10,2),
    discipline VARCHAR(255)
);

CREATE TABLE expedition (
    expedition_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    difficulty VARCHAR(50),
    mountain_chain VARCHAR(255)
);

CREATE TABLE threads (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    thread_id INT REFERENCES threads(unique_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    content VARCHAR(1000) NOT NULL
);

CREATE TABLE news (
    news_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL
);

CREATE TABLE bug_reports (
    bug_report_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL
);
