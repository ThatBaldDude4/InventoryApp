import { Pool } from "pg";

try {
    process.loadEnvFile();
} catch {
    // No .env file
}

const {HOST, PASSWORD, USER, DATABASE, PGPORT} = process.env;
// MSG_URL expect to be full connectionStr typically supplied from a PaaS
const connectionString = process.env.MSG_URL || `postgresql://${USER}:${PASSWORD}@${HOST}:${PGPORT}/${DATABASE}`

const pool = new Pool({
    connectionString
});

export default pool;