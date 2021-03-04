const HEIGHT = window.innerWidth < 600 ? window.innerHeight - 80 : 600;
const WIDTH = window.innerWidth < 600 ? window.innerWidth : 900;
const TOTAL = window.innerWidth < 600 ? 200 : 1000;
const FRAMER = window.innerWidth < 600 ? 120 : Math.floor(WIDTH / 2 - WIDTH / 6);
const LEARNING_RATE = window.innerWidth < 600 ? 40 : 100;