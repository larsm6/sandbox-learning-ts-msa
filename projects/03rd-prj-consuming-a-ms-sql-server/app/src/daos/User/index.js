const sql = require('mssql')

console.log("Request started");
async function do_mssql_request() {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://sa:KaganIstDer123@localhost:1433');
        const result = await sql.query`USE [hero_db];
        SELECT * FROM [heroes];`;
        console.log(result);
        return process.exit(0);
    } catch (err) {
        // ... error checks
        console.log("Error: ", err);
        return process.exit(1);
    }
}

return do_mssql_request();