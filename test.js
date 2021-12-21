const Blockchain = require("./blockchain");

const testCoin = new Blockchain();

testCoin.createNewBlock(2056, "jfklsajfklajfljkla", "jfklejaklfjeajefjalfjea");
testCoin.createNewBlock(
  11,
  "jjksajdklfklsajfklajfljkla",
  "jlfjkldajkfklejaklfjeajefjalfjea"
);
testCoin.createNewBlock(
  20,
  "jkjdflajfdjlafklsajfklajfljkla",
  "jfklejaklfjeajeajfkladjdljjalfjea"
);

console.log(testCoin);
