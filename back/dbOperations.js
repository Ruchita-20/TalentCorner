const sql = require('msnodesqlv8');
const config = require('./dbConfig');


function parseBooleanSearch(searchTerm) {
  const terms = searchTerm.match(/(?:[^\s"]+|"[^"]*")+/g);
  const conditions = terms.map(term => {
    if (term.includes('AND')) {
      const [field, value] = term.split('AND').map(s => s.trim());
      return `(${field} LIKE '%${value}%')`;
    } else if (term.includes('OR')) {
      const [field, value] = term.split('OR').map(s => s.trim());
      return `(${field} LIKE '%${value}%')`;
    } else if (term.includes('NOT')) {
      const [field, value] = term.split('NOT').map(s => s.trim());
      return `(${field} NOT LIKE '%${value}%')`;
    } else {
      return `(Name LIKE '%${term}%' OR Role LIKE '%${term}%' OR current_location LIKE '%${term}%' OR email_id LIKE '%${term}%' OR contact_no LIKE '%${term}%')`;
    }
  });
  return conditions.join(' AND ');
}
async function getUserDetails(contactNo) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Name, email_id, contact_no, current_location, State, Department, Role, Industry, 
                   years_of_experience, ann_salary, curr_company_name, curr_company_duration_from, 
                   curr_company_designation, prev_employer_name, ug_degree, ug_specialization, ug_year, 
                   pg_degree, pg_specialization, pg_college, pg_yeat, Gender, marital_status, Age 
                   FROM naukri_data 
                   WHERE contact_no = ?`;

    sql.query(config, query, [contactNo], (err, rows) => {
      if (err) {
        console.log('Query Error:', err);
        return reject(err);
      }
      resolve(rows[0]); // Assuming contact_no is unique and we get a single record
    });
  });
}
async function getDetails(offset = 0, limit = 10, searchTerm = '', booleanSearch = false) {
  return new Promise((resolve, reject) => {
    let query = `SELECT Name, Role, years_of_experience, current_location, contact_no, email_id FROM naukri_data`;

    if (searchTerm) {
      if (booleanSearch) {
        const booleanCondition = parseBooleanSearch(searchTerm);
        query += ` WHERE ${booleanCondition}`;
      } else {
        query += ` WHERE 
          LOWER(Name) LIKE '%${searchTerm}%' OR 
          LOWER(Role) LIKE '%${searchTerm}%' OR
          LOWER(current_location) LIKE '%${searchTerm}%' OR
          LOWER(email_id) LIKE '%${searchTerm}%' OR
          LOWER(contact_no) LIKE '%${searchTerm}%'`;
      }
    }

    query += ` ORDER BY Name OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

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

async function updateUserDetails(contactNo, userDetails) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE naukri_data SET 
                   Name = ?, email_id = ?, contact_no = ?, current_location = ?, State = ?, Department = ?, 
                   Role = ?, Industry = ?, years_of_experience = ?, ann_salary = ?, curr_company_name = ?, 
                   curr_company_duration_from = ?, curr_company_designation = ?, prev_employer_name = ?, 
                   ug_degree = ?, ug_specialization = ?, ug_year = ?, pg_degree = ?, pg_specialization = ?, 
                   pg_college = ?, pg_yeat = ?, Gender = ?, marital_status = ?, Age = ?
                   WHERE contact_no = ?`;

    const values = [
      userDetails.Name, userDetails.email_id, userDetails.contact_no, userDetails.current_location, userDetails.State, 
      userDetails.Department, userDetails.Role, userDetails.Industry, userDetails.years_of_experience, userDetails.ann_salary, 
      userDetails.curr_company_name, userDetails.curr_company_duration_from, userDetails.curr_company_designation, 
      userDetails.prev_employer_name, userDetails.ug_degree, userDetails.ug_specialization, userDetails.ug_year, 
      userDetails.pg_degree, userDetails.pg_specialization, userDetails.pg_college, userDetails.pg_yeat, 
      userDetails.Gender, userDetails.marital_status, userDetails.Age, contactNo
    ];

    sql.query(config, query, values, (err, result) => {
      if (err) {
        console.log('Update Query Error:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
}
async function getDetails(offset = 0, limit = 10, searchTerm = '', booleanSearch = false) {
  return new Promise((resolve, reject) => {
    let query = `SELECT Name, Role, years_of_experience, current_location, contact_no, email_id FROM naukri_data`;

    if (searchTerm) {
      if (booleanSearch) {
        const booleanCondition = parseBooleanSearch(searchTerm);
        query += ` WHERE ${booleanCondition}`;
      } else {
        query += ` WHERE 
          LOWER(Name) LIKE '%${searchTerm}%' OR 
          LOWER(Role) LIKE '%${searchTerm}%' OR
          LOWER(current_location) LIKE '%${searchTerm}%' OR
          LOWER(email_id) LIKE '%${searchTerm}%' OR
          LOWER(contact_no) LIKE '%${searchTerm}%'`;
      }
    }

    query += ` ORDER BY Name OFFSET ${Math.max(offset, 0)} ROWS FETCH NEXT ${limit} ROWS ONLY`;

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


async function getFiltered(roles, locations, ug_degrees, pg_degrees, ann_salaries, years_of_experience, Gender, Age, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM naukri_data WHERE 1=1`;

    if (roles && roles.length > 0) {
      const roleConditions = roles.map(role => ` Role='${role}'`).join(' OR ');
      query += ` AND (${roleConditions})`;
    }
    if (locations && locations.length > 0) {
      const locationConditions = locations.map(location => ` current_location='${location}'`).join(' OR ');
      query += ` AND (${locationConditions})`;
    }
    if (ug_degrees && ug_degrees.length > 0) {
      const ugDegreeConditions = ug_degrees.map(degree => ` ug_degree='${degree}'`).join(' OR ');
      query += ` AND (${ugDegreeConditions})`;
    }
    if (pg_degrees && pg_degrees.length > 0) {
      const pgDegreeConditions = pg_degrees.map(degree => ` pg_degree='${degree}'`).join(' OR ');
      query += ` AND (${pgDegreeConditions})`;
    }
    if (ann_salaries && ann_salaries.length > 0) {
      const annSalaryConditions = ann_salaries.map(salary => ` ann_salary='${salary}'`).join(' OR ');
      query += ` AND (${annSalaryConditions})`;
    }
    if (years_of_experience && years_of_experience.length > 0) {
      const years_of_experienceConditions = years_of_experience.map(yearexp => ` years_of_experience='${yearexp}'`).join(' OR ');
      query += ` AND (${years_of_experienceConditions})`;
    }
    if (Gender) {
      query += ` AND Gender='${Gender}'`;
    }
    if (Age) {
      query += ` AND TRY_CONVERT(int, Age) = ${Age}`;
    }

    query += ` ORDER BY Name OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
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

async function getData() {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT Role FROM naukri_data`;
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

async function getData1() {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT current_location FROM naukri_data`;
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

async function getUgDegrees() {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT ug_degree FROM naukri_data`;
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

async function getPgDegrees() {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT pg_degree FROM naukri_data`;
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

async function getAnnSalaries() {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT ann_salary FROM naukri_data`;
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

async function getYearsOfExperience() {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT years_of_experience FROM naukri_data`;
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
  getData,
  getData1,
  getUgDegrees,
  getPgDegrees,
  getAnnSalaries,
  getDetails,
  getYearsOfExperience,
  getFiltered,  
  getUserDetails,
  updateUserDetails,
  parseBooleanSearch
};
