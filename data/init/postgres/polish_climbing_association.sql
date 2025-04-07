CREATE TABLE IF NOT EXISTS clubs (
    club_id SERIAL PRIMARY KEY,
    club_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs(club_id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rating_points FLOAT CHECK (rating_points >= 0),
    passwordHash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_role (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Competition', 'Training', 'Expedition')),
    participation_cost DECIMAL(10,2) CHECK (participation_cost >= 0),
    CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS event_user (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    participation_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS competition_results (
    competition_result_id SERIAL PRIMARY KEY,
    event_user_id INT REFERENCES event_user(unique_id) ON DELETE CASCADE,
    points FLOAT NOT NULL CHECK (points >= 0),
    placement INT NOT NULL CHECK (placement > 0)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    description VARCHAR(1000),
    UNIQUE (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS trainings (
    training_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    training_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS competitions (
    competition_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    rank VARCHAR(50),
    reward_pool DECIMAL(10,2) CHECK (reward_pool >= 0),
    discipline VARCHAR(255) NOT NULL CHECK (discipline IN ('Lead', 'Bouldering', 'Speed', 'Combined'))
);

CREATE TABLE IF NOT EXISTS expeditions (
    expedition_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    difficulty VARCHAR(50),
    mountain_chain VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS certificates (
    certificate_id SERIAL PRIMARY KEY,
    training_id INT REFERENCES trainings(training_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS threads (
    unique_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    thread_id INT REFERENCES threads(unique_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    content VARCHAR(1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS news (
    news_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS bug_reports (
    bug_report_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL
);
