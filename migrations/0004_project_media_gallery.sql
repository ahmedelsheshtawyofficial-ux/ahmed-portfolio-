-- Project media gallery: keep primary model/dashboard plus optional extra media URLs.
ALTER TABLE projects ADD COLUMN model_gallery TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN dashboard_gallery TEXT DEFAULT '';
