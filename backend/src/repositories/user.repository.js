const { getDb } = require('../db/connection');

const USER_COLUMNS = 'id, nom, prenom, email, created_at';

const userRepository = {
  findByEmail(email) {
    return getDb()
      .prepare(`SELECT id, nom, prenom, email, mot_de_passe, created_at FROM utilisateurs WHERE email = ? COLLATE NOCASE`)
      .get(email);
  },

  findById(id) {
    return getDb()
      .prepare(`SELECT ${USER_COLUMNS} FROM utilisateurs WHERE id = ?`)
      .get(id);
  },

  create({ nom, prenom, email, mot_de_passe }) {
    const db = getDb();
    const result = db
      .prepare(`
        INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe)
        VALUES (@nom, @prenom, @email, @mot_de_passe)
      `)
      .run({ nom, prenom, email, mot_de_passe });
    return this.findById(result.lastInsertRowid);
  },
};

module.exports = userRepository;
