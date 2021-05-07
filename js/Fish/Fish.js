const getDistance = (nodeA, nodeB) => {
    const dx = Math.pow((nodeA.position.x - nodeB.position.x), 2);
    const dy = Math.pow((nodeA.position.y - nodeB.position.y), 2);
    return Math.sqrt(dx + dy);
}

const getClosestFish = (me, otherFishs) => {
    let closest = otherFishs[0];
    let closestDistance = getDistance(me, otherFishs[0]);
    for (let i = 1; i < otherFishs.length; i++) {
        if (getDistance(me, otherFishs[i]) < closestDistance) {
            closest = otherFishs[i];
            closestDistance = getDistance(me, otherFishs[i]);
        }
    }
    return closest;
}

class SmallFish {
    constructor(brain) {
        const y = Math.random() * HEIGHT;
        const x = Math.random() * WIDTH;
        this.position = {x,y};
        this.heading = {
            x: (0.5 - Math.random()),
            y: (0.5 - Math.random()),
        };
        this.score = 0;
        this.fitness = 0;
        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new NeuralNetwork(8, 100, 2);
        }
    }

    show () {
        fill(255, 255, 0);
        ellipse(this.position.x, this.position.y, 16, 16);
    };

    move () {
        this.score = this.score + 1;
        let moveX = this.position.x + this.heading.x;
        let moveY = this.position.y + this.heading.y;
        this.position.x = moveX;
        this.position.y = moveY;
        if (moveX >= WIDTH || moveX <= 0) {
            this.heading.x = -this.heading.x;
        }
        if (moveY >= HEIGHT || moveY <= 0) {
            this.heading.y = -this.heading.y;
        }
    }

    think(bigFishs) {
        const closestBigFish = getClosestFish(this, bigFishs);
        let inputs = [];
        inputs[0] = WIDTH - (WIDTH - this.position.x);
        inputs[1] = HEIGHT - (HEIGHT - this.position.y);
        inputs[2] = WIDTH - (WIDTH - closestBigFish.position.x);
        inputs[3] = HEIGHT - (HEIGHT - closestBigFish.position.y);
        inputs[4] = this.heading.x;
        inputs[5] = this.heading.y;
        inputs[6] = closestBigFish.heading.x;
        inputs[7] = closestBigFish.heading.y;
        let output = this.brain.predict(inputs);
        this.heading.x = 1 - (output[0] * 2);
        this.heading.y = 1 - (output[1] * 2);
    }

    mutate () {
        this.brain.mutate(function (x) {
          return x + randomGaussian(0, 0.001);
        })
    }
}

class BigFish {
    constructor(brain) {
        const y = Math.random() * HEIGHT;
        const x = Math.random() * WIDTH;
        this.position = {x,y};
        this.heading = {
            x: (0.5 - Math.random()),
            y: (0.5 - Math.random()),
        };
        this.score = 0;
        this.fitness = 0;
        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new NeuralNetwork(8, 100, 2);
        }
    }

    show () {
        fill(255, 0, 0);
        ellipse(this.position.x, this.position.y, 16, 16);
    };

    move () {
        this.score = this.score + 1;
        let moveX = this.position.x + this.heading.x;
        let moveY = this.position.y + this.heading.y;
        this.position.x = moveX;
        this.position.y = moveY;
        if (moveX >= WIDTH || moveX <= 0) {
            this.heading.x = -this.heading.x;
        }
        if (moveY >= HEIGHT || moveY <= 0) {
            this.heading.y = -this.heading.y;
        }
    }
  
    think(smallFishs) {
        const closestSmallFish = getClosestFish(this, smallFishs);
        const distance = getDistance(this, closestSmallFish);
        this.heading.x = (closestSmallFish.position.x - this.position.x)/distance;
        this.heading.y = (closestSmallFish.position.y - this.position.y)/distance;
    }

    mutate () {
        this.brain.mutate(function (x) {
            return x + randomGaussian(0, 0.001);
        })
    }
}
  

// some tests
const runTests = false;

const checkGetDistance = () => {
    const a = {
        position: {
            x: 4,
            y: 3,
        }
    }
    const b = {
        position: {
            x: 0,
            y: 0,
        }
    }
    console.log('A:', a.position, 'B:', b.position, 'Distance:', getDistance(a, b))
}

const checkClosestFish = () => {
    const a = { position: { x: 4, y: 3 } };
    const b = { position: { x: 0, y: 5 } };
    const c = { position: { x: 3, y: 0 } };
    const me = { position: { x: 0, y: 0 } };
    console.log('Checking closestFish function:');
    console.log('Me:', me);
    console.log('Other fishes:', [a, b, c]);
    console.log('Closest:', getClosestFish(me, [a, b, c]));
}

if (runTests) {
    checkGetDistance();
    checkClosestFish();
}