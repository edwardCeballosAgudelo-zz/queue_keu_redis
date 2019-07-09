
let kue   = require('kue');
let queue = kue.createQueue();

queue.process(`download`, function(job, done){
  downloadFile(job, done);
});


async function downloadFile (job, done) {
  try {
    const mongoose = require('mongoose')
    const initialTime = Date.now();
    let cont = 0; 

    mongoose.connect(job.data.cadenaConexion, {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      poolSize: 5
    }).then(() => { 
      const reception = require('./models/receptions')
      const stream = reception.find({}).lean().cursor();
      stream.on('data', () => { cont += 1; });

      stream.on('close', () => {
        const totalTime = Date.now() - initialTime;
        console.log(`Execution ended. Number of elements: ${cont}. Elapsed time: ${(totalTime / 1000)} seconds`);
        done();
      });
    })
  } catch (error) {
    console.log(error);
  }
}
