-- +++ UP +++
CREATE TABLE IF NOT EXISTS combinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE
);

-- +++ DOWN +++
DROP TABLE IF EXISTS combinations;
