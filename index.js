const express = require("express")
const fs = require('fs').promises;
const path = require("path")
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cors());
let news = [];

async function loadNews() {
    try {
      const fileNames = await fs.readdir(path.join(__dirname, 'news'));
  
      const newsPromises = fileNames.map(async (fileName) => {
        const filePath = path.join(__dirname, 'news', fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
  
        return {
          fileName: fileName,
          creationTimestamp: extractTimestamp(fileName),
          username: extractUsername(fileName),
          content: fileContent,
        };
      });
  
      // Wait for all promises to resolve
      news = await Promise.all(newsPromises);
    } catch (err) {
      console.error(err);
    }
  }

  function extractTimestamp(filename) {
    // Extract the timestamp from the filename
    const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '';
  }
  
  function extractUsername(filename) {
    // Extract the username from the filename
    const match = filename.match(/(\w+)\.txt/);
    return match ? match[1] : '';
  }

loadNews();

app.get('/news', (req, res) => {
 res.json(news);
});


// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on port ${port}`));
