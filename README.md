CREATE TABLE channels(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, slave_id INTEGER NOT NULL, type VARCHAR(32) NOT NULL, channel TINYINT NOT NULL, name VARCHAR(64) NOT NULL, description VARCHAR(128), FOREIGN KEY(slave_id) REFERENCES slaves(id) ON DELETE CASCADE);
CREATE TABLE rfir_devices(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, slave_id INTEGER NOT NULL, type VARCHAR(16) NOT NULL, category VARCHAR(32), name VARCHAR(64) NOT NULL, description VARCHAR(128), model VARCHAR(255), FOREIGN KEY(slave_id) REFERENCES slaves(id) ON DELETE CASCADE);
CREATE TABLE rfir_commands(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, device_id INTEGER NOT NULL, name VARCHAR(32) NOT NULL, page_low TINYINT NOT NULL, page_high TINYINT NOTNULL, FOREIGN KEY(device_id) REFERENCES rfir_devices(id) ON DELETE CASCADE);
CREATE TABLE rfir_remotes (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER NOT NULL,
    name VARCHAR(32) NOT NULL,
    FOREIGN KEY(device_id) REFERENCES rfir_devices(id) ON DELETE CASCADE
);
CREATE TABLE rfir_buttons (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    remote_id INTEGER NOT NULL,
    command_id INTEGER NOT NULL,
    name VARCHAR(32) NOT NULL,
    indexes VARCHAR(52) NOT NULL, color INTEGER,
    FOREIGN KEY(command_id) REFERENCES rfir_commands(id) ON DELETE CASCADE,
    FOREIGN KEY(remote_id) REFERENCES rfir_remotes(id) ON DELETE CASCADE
);
CREATE TABLE scenes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, json TEXT, description VARCHAR(64), name VARCHAR(64));
CREATE TABLE raw_energy (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    value INTEGER NOT NULL,
    datetime INTEGER,
    slave_id INTEGER,
    FOREIGN KEY(slave_id) REFERENCES slave(id)
);
CREATE TABLE ambients (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    image TEXT
);
CREATE TABLE ambients_rfir_devices_rel (
    ambient_id INTEGER NOT NULL,
    rfir_device_id INTEGER NOT NULL,
    FOREIGN KEY(ambient_id) REFERENCES ambients(id),
    FOREIGN KEY(rfir_device_id) REFERENCES rfir_devices(id)
);
CREATE TABLE ambients_channels_rel (
    ambient_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    FOREIGN KEY(ambient_id) REFERENCES ambients(id),
    FOREIGN KEY(channel_id) REFERENCES channels(id)
);

