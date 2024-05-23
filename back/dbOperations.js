const sql = require('msnodesqlv8');
const config = require('./dbConfig');

async function getDetails(offset = 0, limit = 20) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Name, Role, years_of_experience, current_location, Department, contact_no, email_id FROM naukri_data ORDER BY Name OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    sql.query(config, query, (err, rows) => {
      if (err) {
        console.log('Query Error:', err);
        return reject(err);
      }
      console.log('Query Result:', rows);
      resolve(rows);
    });
  });
}

module.exports = {
  getDetails
};
