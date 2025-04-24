-- +++ UP +++
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    combination_id INT NOT NULL,
    label VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (combination_id) REFERENCES combinations(id) ON DELETE CASCADE
);

-- +++ DOWN +++
DROP TABLE IF EXISTS items;
