
let kue   = require('kue');
let queue = kue.createQueue();

queue.process(`download`, function(job, done){
  console.log(`Working on job ${job.id}`);
  console.log(job.data);
  downloadFile(job.data.file, done);
});


async function downloadFile (file, done) {
  await setTimeout(() => {}, 1000);
  console.log(`Downloading file : ${file}`);
  await setTimeout(() => {}, 1000);
  console.log(`Download Complete`);
  done();
}
