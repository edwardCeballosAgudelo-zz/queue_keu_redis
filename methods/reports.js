let kue   = require(`kue`);
let queue = kue.createQueue();

async function generateCsv(req, res, next) {
  let job = queue.create(`download`, { query: req.body.query, limit: req.body.limit, cadenaConexion: req.body.cadenaConexion}).attempts(3).backoff({delay: 60 * 1000}).save();
  job.on( 'progress', function ( progress ) {
    console.log('\r progress '% complete);
    next()
  });
  res.json({success: 'Successfully assigned job to the worker'});
}

module.exports = {
  generateCsv
}
