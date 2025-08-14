import sqlite from "sqlite3";

const CURRENT_VERSION = 2;

// I'll have to figure out a better way to do this I'm sure but should work for now.
export const update = (version: number, db: sqlite.Database): void => {
  if (version === CURRENT_VERSION) return console.log("All up to date!");
  if (version < 1) {
    db.exec("ALTER TABLE recipe ADD COLUMN totalTime INTEGER", err => {
      if (err && err.message) console.log("error I guess: ", err.message);
    });
  }
  if (version < 2) {
    db.exec("ALTER TABLE recipeToRecipe ADD COLUMN label TEXT", err => {
      if (err && err.message) console.log("error from updating: ", err.message);
      db.run(`PRAGMA user_version = ${CURRENT_VERSION}`);
    });
  }
};

export const setup = (db: sqlite.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
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
          instructions TEXT,
          totalTime INTEGER
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS folderRecipe (
          folderId INTEGER NOT NULL,
          recipeId INTEGER NOT NULL,
          FOREIGN KEY (folderId)
            REFERENCES folder (id) ON DELETE CASCADE,
          FOREIGN KEY (recipeId)
            REFERENCES recipe (id) ON DELETE CASCADE,
          CONSTRAINT PK_folder PRIMARY KEY (recipeId, folderId)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS recipeToRecipe (
          recipeParentId	INTEGER,
          recipeChildId	INTEGER,
          label TEXT,
          FOREIGN KEY(recipeChildId)
            REFERENCES recipe(id) ON DELETE CASCADE,
          FOREIGN KEY(recipeParentId)
            REFERENCES recipe(id) ON DELETE CASCADE,
          CONSTRAINT PK_RtoR PRIMARY KEY(recipeParentId,recipeChildId)
        );  
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
      db.run(`
        CREATE TABLE IF NOT EXISTS timer (
          id INTEGER NOT NULL,
          name TEXT NOT NULL,
          minTime	NUMERIC,
          maxTime	NUMERIC,
          measurement TEXT,
          recipeId INTEGER,
          FOREIGN KEY(recipeId)
            REFERENCES recipe(id) ON DELETE CASCADE,
          PRIMARY KEY(id AUTOINCREMENT)
        );
      `, () => {
        resolve();
      });
      db.get("PRAGMA user_version", (err, {user_version}) => {
        if (user_version === 0) {
          db.run(`PRAGMA user_version = ${CURRENT_VERSION}`);
        } else {
          update(user_version, db);
        }
        if (err) {
          reject(err);
        }
      });
    });
  });
}