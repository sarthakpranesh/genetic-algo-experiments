class GeneticAlgorithm {
  constructor(type, total) {
    this.type = type;
    this.total = total;
    this.generationNumber = 1;
    this.dead = [];
    this.population = new Array(this.total).fill(1).map(() => {
      return new this.type();
    })
  }

  calculateFitness() {
    let sum = 0;
    this.dead.forEach((person) => {
      sum = sum + person.score
    });
    this.dead.forEach((person) => {
      person.fitness = person.score / sum;
    });
  }

  createNextGeneration() {
    this.calculateFitness();
    const bestDead = this.dead.sort((a, b) => b.fitness - a.fitness)[0];
    if (bestDead.score === 0) {
      // no worthy candidate for next generation
      this.population = new Array(this.total).fill(1).map(() => {
        return new this.type();
      });
    } else {
      this.population = new Array(this.total).fill(1).map((_, i) => {
        const person = new this.type(bestDead.brain);
        person.mutate(i / this.total);
        return person;
      });
    }
    this.dead = [];
    this.generationNumber = this.generationNumber + 1;
  }
}
