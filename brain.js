class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.input_nodes = inputNodes;
    this.hidden_nodes = hiddenNodes;
    this.output_nodes = outputNodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();
    this.activation_function = {
      func: x => 1 / (1 + Math.exp(-x)),
      dfunc: y => y * (1 - y),
    };
    this.learning_rate = 0.1;
  }

  predict(input_array) {
    const inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(this.activation_function.func);
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);
    return output.toArray();
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }

  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }
}