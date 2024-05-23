const dboperations = require('./dbOperations');

dboperations.getDetails().then(result => {
  console.log('Login Details:', result);
}).catch(err => {
  console.log('Error:', err);
});
