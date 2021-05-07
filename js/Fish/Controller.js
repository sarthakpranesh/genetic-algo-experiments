// hacky
let CANVAS_WIDTH;
let CANVAS_HEIGHT;

// some storage
let gaSmall;
let gaBig;
let count = 0;

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('canvasDiv');
  learningSpeed = createSlider(1, LEARNING_RATE, 1);
  learningSpeed.parent('learningSpeed');

  // get reference to document ele
  curSpeed = document.getElementById('curSpeed');

  // load assets
  bg = '#7fcdff';
  
  // setup nodes
  gaSmall = new GeneticAlgorithm(SmallFish, 100);
  gaBig = new GeneticAlgorithm(BigFish, 2);
}

function draw() {
  background(bg);
  
  // update the sketch position of all fishes
  for (let fish of [...gaSmall.population, ...gaBig.population]) {
    fish.show();
  }

  // main logic computation
  for (let n = 0; n < learningSpeed.value(); n++ ) {
    
    // update the small fish population
    gaSmall.population.forEach((fish) => {
      fish.think(gaBig.population);
      fish.move();
    })

    gaSmall.population = gaSmall.population.filter((fish) => {
      // if fish out of tank
      if (fish.position.x < 0 || fish.position.x > WIDTH) {
        gaSmall.dead.push(fish);
        return false;
      }
      if (fish.position.y < 0 || fish.position.y > HEIGHT) {
        gaSmall.dead.push(fish);
        return false;
      }
      // if fish gets eatten by large fish
      for (let bf of gaBig.population){
        if (bf.position.x + 5 > fish.position.x && bf.position.x - 5 < fish.position.x) {
          if (bf.position.y + 5 > fish.position.y && bf.position.y - 5 < fish.position.y) {
            gaSmall.dead.push(fish);
            return false;
          }
        }
      }
      return true;
    })

    // update the big fish population
    gaBig.population.forEach((fish) => {
      if (gaSmall.population.length !== 0) {
        fish.think(gaSmall.population);
        fish.move();
      }
    })

    // run when no one left in population
    if (gaSmall.population.length === 0) {
      gaSmall.createNextGeneration();

      count = 0;
    }
    count++;

    // show values
    curSpeed.innerText = learningSpeed.value();
  }
}