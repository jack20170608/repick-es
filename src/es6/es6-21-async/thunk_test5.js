import fs from 'fs';
import thunkify from 'thunkify';


const readFileThunk = thunkify(fs.readFile);

const gen = function* () {
  const r1 = yield readFileThunk('./foo.txt');
  console.log(r1.toString());
  const r2 = yield readFileThunk('./bar.txt');
  console.log(r2.toString());
}

const g = gen();
const r1 = g.next();

r1.value(function (err, data) {
  if (err) {
    throw err;
  }
  let r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) {
      throw err;
    }
    g.next(data);
  })
})
