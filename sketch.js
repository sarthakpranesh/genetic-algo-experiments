let count = 0;
let numberOfGenerations = 0;
var birds = [];
var saveBirds = []
var pipes = [];

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT - 40), WebGL2RenderingContext;
  canvas.parent('canvasDiv');
  learningSpeed = createSlider(1, 100, 1);
  learningSpeed.parent('learningSpeed');
  barGap = createSlider(FRAMER/2, FRAMER, FRAMER);
  barGap.parent('barGap');
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {

  if (isUser) {
    background(100);
    for (let bird of birds) {
      bird.show();
    }
    for (let pipe of pipes) {
      pipe.show();
    }
  }

  // main logic computation
  for (let n = 0; n < learningSpeed.value(); n++ ) {
    if (count % barGap.value() == 0) {
      pipes.push(new Pipe())
    }

    pipes = pipes.filter(pipe => {
      pipe.update();

      birds = birds.filter((bird) => {
        if (pipe.hits(bird)) {
          saveBirds.push(bird);
          return false;
        }
        return true;
      });

      if (pipe.offscreen()) {
        return false;
      }
      return true;
    });

    birds.forEach((bird) => {
      bird.think(pipes);
      bird.update()
    });

    if (birds.length === 0) {
      count = 0;
      nextGeneration();
      numberOfGenerations++;
      pipes = [];
      pipes.push(new Pipe())
    }

    count++;
  }
}