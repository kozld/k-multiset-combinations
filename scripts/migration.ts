import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

async function parseSqlFile(filepath: string): Promise<{ up: string; down: string }> {
  const content = fs.readFileSync(filepath, 'utf-8');
  const upMatch = content.match(/--\s*\+{3}\s*UP\s*\+{3}\s*\n([\s\S]*?)--\s*\+{3}/i);
  const downMatch = content.match(/--\s*\+{3}\s*DOWN\s*\+{3}\s*\n([\s\S]*)/i);

  return {
    up: upMatch?.[1]?.trim() || '',
    down: downMatch?.[1]?.trim() || '',
  };
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const connection = await mysql.createConnection({
    host: 'combigen-api-mysql',
    user: 'user',
    password: 'password',
    database: 'mydb',
    multipleStatements: true,
  });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      run_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const [rows] = await connection.query('SELECT name FROM migrations');
  const applied = new Set((rows as any[]).map(row => row.name));

  const migrationsDir = path.join(__dirname, '../db/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  if (command === 'up') {
    for (const file of files) {
      if (!applied.has(file)) {
        const { up } = await parseSqlFile(path.join(migrationsDir, file));
        console.log(`Applying migration: ${file}`);
        await connection.query(up);
        await connection.query(`INSERT INTO migrations (name) VALUES (?)`, [file]);
      }
    }
    console.log('All migrations applied.');
  } else if (command === 'down') {
    const lastMigration = [...applied].sort().pop();
    if (!lastMigration) {
      console.log('No migrations to roll back.');
      return;
    }
    const { down } = await parseSqlFile(path.join(migrationsDir, lastMigration));
    if (!down) {
      console.log(`Migration ${lastMigration} has no DOWN section.`);
      return;
    }
    console.log(`Rolling back migration: ${lastMigration}`);
    await connection.query(down);
    await connection.query(`DELETE FROM migrations WHERE name = ?`, [lastMigration]);
  } else {
    console.log('Usage: npm run migrate up|down');
  }

  await connection.end();
}

main();
