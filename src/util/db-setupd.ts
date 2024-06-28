import sqlite from "sqlite3";

export const setup = (db: sqlite.Database): void => {
	db.serialize(() => {
		db.run(`
			CREATE TABLE IF NOT EXISTS folder (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL
			);
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS recipe (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				description TEXT,
				notes TEXT,
				folderId INTEGER,
				FOREIGN KEY (folderId)
					REFERENCES folder (id)
			);
		`);
		db.run(`
			CREATE TABLE IF NOT EXISTS ingredientGroup (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				groupName TEXT NOT NULL,
				recipeId INTEGER,
				FOREIGN KEY (recipeId)
					REFERENCES recipe (id)
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
			);
		`);
	});
}