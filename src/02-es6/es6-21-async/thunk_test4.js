import fs from 'fs';
import thunkify from 'thunkify';


const readFileThunk = thunkify(fs.readFile);
 readFileThunk('./foo.txt', 'utf8')((err, data) => {
  if (err) {
    throw err;
  }
  console.log(data);
})
