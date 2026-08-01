-- Up
INSERT INTO roles (name, display_name, description)
VALUES ('user_kontributor', 'User & Kontributor Berita', 'Bisa memesan ruangan sekaligus membuat berita/artikel');

-- Down
DELETE FROM roles WHERE name = 'user_kontributor';
