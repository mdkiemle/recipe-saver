import sqlite from "sqlite3";

export const setup = (db: sqlite.Database): void => {
	db.serialize(() => {
		db.run(`
			CREATE TABLE IF NOT EXISTS folder (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL
			)
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS recipe (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				description TEXT,
				notes TEXT,
				instructions TEXT
			)
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS folderRecipe (
				folderId INTEGER NOT NULL,
				recipeId INTEGER NOT NULL,
				FOREIGN KEY (folderId)
					REFERENCES folder (id),
				FOREIGN KEY (recipeId)
					REFERENCES recipe (id)
				CONSTRAINT PK_folder PRIMARY KEY (recipeId, folderId)
			)
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS ingredientGroup (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				groupName TEXT NOT NULL,
				recipeId INTEGER,
				FOREIGN KEY (recipeId)
					REFERENCES recipe (id)
					ON DELETE CASCADE
			)
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS ingredient (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item TEXT NOT NULL,
				measurement TEXT NOT NULL,
				ingredientGroupId INTEGER,
				FOREIGN KEY (ingredientGroupId)
					REFERENCES ingredientGroup (id)
					ON DELETE CASCADE
			)
		`);
	});
}