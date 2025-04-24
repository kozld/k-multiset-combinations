"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2/promise"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function parseSqlFile(filepath) {
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
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
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
    const applied = new Set(rows.map(row => row.name));
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
    }
    else if (command === 'down') {
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
    }
    else {
        console.log('Usage: npm run migrate up|down');
    }
    await connection.end();
}
main();
//# sourceMappingURL=migration.js.map