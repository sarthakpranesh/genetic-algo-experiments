class Bird {
  constructor(brain) {
    this.y = HEIGHT / 2;
    this.x = WIDTH / 4;

    this.gravity = 0.3;
    this.velocity = 0;

    this.lift = -6;

    this.score = 0;
    this.fitness = 0;
    if (brain) {
      this.brain = brain;
    } else {
      this.brain = new NeuralNetwork(5, 5, 1);
    }
  }

  show () {
    fill(255, 255, 0)
    ellipse(this.x, this.y, 16, 16);
  };

  think(pipes) {
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i].x - this.x + pipes[i].w;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d
      }
    }
    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.top / height;
    inputs[2] = closest.bottom / height;
    inputs[3] = closest.x / width;
    inputs[4] = this.velocity / 10;
    let output = this.brain.predict(inputs);
    if (output[0] > 0.5) {
      this.up();
    }
  }

  update () {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  };

  up () {
    this.velocity += this.lift;
  };

  mutate () {
    this.brain.mutate(function (x) {
      return x + randomGaussian(0, 0.001);
    })
  }
}
