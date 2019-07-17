let kue = require('kue');
let queue = kue.createQueue();
const winston = require('winston')

queue.process(`download`, function (job, done) {
  downloadFile(job, done);
});


async function downloadFile(job, done) {
  const mongoose = require('mongoose');
  const Reception = require('../models/receptions')
  run().catch(error => console.error(error.stack));
  
  async function run() {
    let cont = 0
    console.time('init')
    await mongoose.connect(job.data.cadenaConexion, { useNewUrlParser: true });
    for (let i = 0; i < job.data.total; i++) {
      cont = cont + 1
      job.progress(cont, job.data.total);
      const array = []
      pathFile = 'data'+ i +'.csv'
      await Reception.find(job.data.query).select('-Body').sort('ReceptionDate').skip(i).limit(job.data.limit).lean().cursor().eachAsync((doc) => 
      {
        array.push(doc);
        return; 
      }, { parallel: 50 });
      await generateFileCsv(array, pathFile, '/', 'jsonFields.Value')
      console.log('partial ', array.length);
    } 
    console.timeEnd('init')
    process.exit(0);
  }

  async function generateFileCsv (receptionList, pathFile, pathName, jsonFields) {
    try {
      const Json2csvParser = require('json2csv').Parser
      const fs = require('fs')
      const fields = await jsonData()
      const opts = { fields }
      const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' }
      const parser = new Json2csvParser(opts, transformOpts)
      const csv = parser.parse(receptionList)
      if (!fs.existsSync(pathName)) {
        await fs.mkdirSync(pathName, { recursive: true })
      }
      // Crea el archivo de inmediato para que exista
      await fs.writeFileSync(pathFile, '', { flag: 'w' })
      await fs.writeFileSync(pathFile, csv, { flag: 'w' })
    } catch (err) {
      winston.error(err)
    }
   }

   async function jsonData(params) {
    let json = [
      {
        "label": "ID Cliente",
        "value": "CustomerID",
        "default": ""
      },
      {
        "label": "Nombre Cliente",
        "value": "CustomerName",
        "default": ""
      },
      {
        "label": "Tipo Documento",
        "value": "TypeDocument",
        "default": ""
      },
      {
        "label": "Cufe",
        "value": "UUID",
        "default": ""
      },
      {
        "label": "Número Documento",
        "value": "DocumentNumber",
        "default": ""
      },
      {
        "label": "Nit Proveedor",
        "value": "IdBusinesss",
        "default": ""
      },
      {
        "label": "Fecha Factura",
        "value": "IssueDateTime",
        "default": ""
      },
      {
        "label": "Subtotal",
        "value": "LineExtensionAmount",
        "default": ""
      },
      {
        "label": "Base Impuestos",
        "value": "TaxExclusiveAmount",
        "default": ""
      },
      {
        "label": "Valor a Pagar",
        "value": "PayableAmount",
        "default": ""
      },
      {
        "label": "ID Proveedor",
        "value": "ProviderID",
        "default": ""
      },
      {
        "label": "Nombre Proveedor",
        "value": "ProviderName",
        "default": ""
      },
      {
        "label": "Mail Receptor",
        "value": "Reception",
        "default": ""
      },
      {
        "label": "Fecha Recepción",
        "value": "ReceptionDate",
        "default": ""
      },
      {
        "label": "Correo Emisor",
        "value": "Send",
        "default": ""
      },
      {
        "label": "Estado",
        "value": "Status",
        "default": ""
      },
      {
        "label": "Estado Final",
        "value": "StatusFinally",
        "default": ""
      },
      {
        "label": "Perfil Aprobación",
        "value": "ApprovalProfile.CodeProfile",
        "default": ""
      },
      {
        "label": "Nivel Perfil Aprobación",
        "value": "LevelApprovalProfile.LevelApprovalProfile",
        "default": ""
      },
      {
        "label": "Usuario",
        "value": "User",
        "default": ""
      },
      {
        "label": "Comentario",
        "value": "Comment",
        "default": ""
      }]
      return json
   }
   
}