const path = require('path');
const express = require('express')
const cors = require('cors')
const Backend_builder = require('./Services/Backend_builder');
const generateCreateTableQueries = require('./Services/create_sql_table');
const frontend_builder = require('./Services/frontend_builder');
const fs = require('fs');
const archiver = require('archiver');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Replace this with your table data
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


const generateZipOfResult = async (res, base_folder = "dist") => {
  const resultFolderPath = path.join(__dirname, base_folder);
  const zipPath = path.join(__dirname, 'Response.zip');
  const output = fs.createWriteStream(zipPath); // Corrected this line
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

    // Send the zip file path to the frontend
    res.download(zipPath, 'Response.zip', (err) => {
      if (err) {
        console.error('Error sending zip file:', err);
        res.status(500).send('Internal Server Error');
      } else {
        // Optionally, you can remove the generated zip file after it's sent
        fs.unlink(zipPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting zip file:', unlinkErr);
          }
        });
      }
    });
  });

  archive.on('error', (err) => {
    console.error('Error creating zip file:', err);
  });

  // Add the `base_folder` folder to the zip file (use base_folder instead of resultFolderPath)
  archive.directory(resultFolderPath, base_folder); // Corrected this line
  archive.pipe(output);
  archive.finalize();
}


app.get("/", (req, res)=> {
  res.render('index', { pageTitle: 'Initiated Project' });
})

app.post("/build", (req, res)=> {
  const { tableData } = req.body;
  const response_folder = path.join(__dirname, 'dist')
  if (!fs.existsSync(response_folder)) {
    fs.mkdirSync(response_folder);
  }
  Backend_builder(tableData)
  frontend_builder(tableData)
  fs.writeFileSync(path.join(response_folder, `batch.sql`), generateCreateTableQueries(tableData));
  res.send({data: "Ready"})
})

app.get("/download", (req, res)=> {
  generateZipOfResult(res)
})

app.listen(PORT, ()=> {
  console.log("Server Started On port " + PORT);
})