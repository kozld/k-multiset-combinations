-- +++ UP +++
CREATE TABLE IF NOT EXISTS responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_body_raw  JSON NOT NULL,
    response_body_raw JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +++ DOWN +++
DROP TABLE IF EXISTS responses;
