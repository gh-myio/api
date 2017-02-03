CREATE TABLE raw_energy (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    value INTEGER NOT NULL,
    datetime INTEGER,
    slave_id INTEGER,
    FOREIGN KEY(slave_id) REFERENCES slave(id)
);
