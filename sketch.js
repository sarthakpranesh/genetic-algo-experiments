let count = 0;
let numberOfGenerations = 0;
var birds = [];
var saveBirds = []
var pipes = [];

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT - 40), WebGL2RenderingContext;
  canvas.parent('canvasDiv');
  slider = createSlider(1, 100, 1);
  slider.parent('frameRate');
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
  for (let n = 0; n < slider.value(); n++ ) {
    if (count % FRAMER == 0) {
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

    // for (var i = pipes.length - 1; i >= 0; i--) {
    //   pipes[i].update();
  
    //   for (let j = birds.length-1; j >= 0; j--) {
    //     if (pipes[i].hits(birds[j])) {
    //       saveBirds.push(birds[j]);
    //       birds.splice(j, 1);
    //     }
    //   }
  
    //   if (pipes[i].offscreen()) {
    //     pipes.splice(i, 1);
    //   }
    // }

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
      console.log("Number of Generations: ", numberOfGenerations);
    }

    count++;
  }
}