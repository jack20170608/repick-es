let color = 'blue';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function changeColor() {
  let anotherColor = 'red';

  function swapColor() {
    let tempColor = color;
    color = anotherColor;
    anotherColor = tempColor;
  }
  swapColor();
  for(let i=0; i < 20; i++) {
    console.log("sleep inside.....")
    await sleep(100);
  }
}

changeColor();
console.log(color);

for(let i=0; i < 20; i++) {
  console.log("sleep inside.....")
  await sleep(100);
}

