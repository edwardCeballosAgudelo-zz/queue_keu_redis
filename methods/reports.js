let kue   = require(`kue`);
let queue = kue.createQueue();

async function generateCsv(req, res, next) {
  queue.create(`download`, { cadenaConexion: 'cadena' }).attempts(3).backoff({delay: 60 * 1000}).save();
  res.json({success: 'Successfully assigned job to the worker'});
}

module.exports = {
  generateCsv
}
