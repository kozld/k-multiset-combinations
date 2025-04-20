CREATE TABLE IF NOT EXISTS combination_items (
    combination_id INT NOT NULL,
    item_id INT NOT NULL,
    PRIMARY KEY (combination_id, item_id),
    FOREIGN KEY (combination_id) REFERENCES combinations(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);