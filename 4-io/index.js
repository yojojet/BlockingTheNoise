function setup() {
  // p5 js setup
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  // p5 js ensure canvas size is updated
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // the draw() loops forever, until stopped  
  console.log('drawing')

  // this helper function will run continuously
  helperFunctionForDebugging()

  // this draw-a-point function will run continuously
  drawAPoint()
  
}

function mousePressed() {
  // this function will trigger when mouse is down
  console.log('mouse is down')
}

function mouseReleased() {
  // this function will trigger when mouse is up
  console.log('mouse is up')
}

function helperFunctionForDebugging() {
  // this function is for debugging
  
  // example
  // we can get basic input such as X and Y coordinates from the mouse cursor
  const x = mouseX;
  const y = mouseY;
}

function drawAPoint() {
  // this function is for drawing

  // see how you can draw a point. follow this documentation
  // https://p5js.org/reference/#/p5/point

  // 
  // add you code here
  // 

}