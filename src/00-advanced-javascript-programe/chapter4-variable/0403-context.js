let color = 'blue';

function changeColor() {
  let anotherColor = 'red';

  function swapColor() {
    let tempColor = color;
    color = anotherColor;
    anotherColor = tempColor;
  }
  swapColor();
}

changeColor();
console.log(color);


