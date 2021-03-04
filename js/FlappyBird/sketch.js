let count = 0;
var pipes = [];

let ga = new GeneticAlgorithm(Bird, TOTAL);

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT - 40);
  canvas.parent('canvasDiv');
  learningSpeed = createSlider(1, LEARNING_RATE, 1);
  learningSpeed.parent('learningSpeed');
  barGap = createSlider(FRAMER/4, FRAMER, FRAMER);
  barGap.parent('barGap');

  // get reference to document ele
  curSpeed = document.getElementById('curSpeed');
  curBarGap = document.getElementById('curBarGap');

  // load assets
  bg = loadImage('/images/bg.png');
}

function draw() {
  background(bg);
  
  // update the sketch position of all bodies
  for (let bird of ga.population) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }

  // main logic computation
  for (let n = 0; n < learningSpeed.value(); n++ ) {
    if (count % barGap.value() == 0) {
      pipes.push(new Pipe())
    }

    pipes = pipes.filter(pipe => {
      pipe.update();

      ga.population = ga.population.filter((bird) => {
        if (pipe.hits(bird)) {
          ga.dead.push(bird);
          return false;
        }
        return true;
      });

      if (pipe.offscreen()) {
        return false;
      }
      return true;
    });

    // update everyone in population
    ga.population.forEach((bird) => {
      bird.think(pipes);
      bird.update()
    });

    // run when no one left in population
    if (ga.population.length === 0) {
      ga.createNextGeneration();

      count = 0;
      pipes = [];
      pipes.push(new Pipe())
    }
    count++;

    // show values
    curSpeed.innerText = learningSpeed.value();
    curBarGap.innerText = barGap.value();
  }
}