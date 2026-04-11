-- Migration: Add agenda_id to church_announcements
-- Description: Optional link between an announcement and its source agenda
-- Date: 2026-04-10

ALTER TABLE church_announcements
  ADD COLUMN agenda_id INT NULL DEFAULT NULL AFTER display_order,
  ADD INDEX idx_agenda_id (agenda_id),
  ADD CONSTRAINT fk_announcement_agenda
    FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE SET NULL;
