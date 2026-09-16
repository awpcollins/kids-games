/* Paths are relative to each game page under games/<name>/. */
const CATEGORIES = {
  animals: {
    id: "animals",
    name: "Animals",
    icon: "../../assets/animals/lion.png",
    items: [
      { id: "lion", name: "Lion", image: "../../assets/animals/lion.png" },
      { id: "elephant", name: "Elephant", image: "../../assets/animals/elephant.png" },
      { id: "giraffe", name: "Giraffe", image: "../../assets/animals/giraffe.png" },
      { id: "zebra", name: "Zebra", image: "../../assets/animals/zebra.png" },
      { id: "tiger", name: "Tiger", image: "../../assets/animals/tiger.png" },
      { id: "bear", name: "Bear", image: "../../assets/animals/bear.png" },
      { id: "penguin", name: "Penguin", image: "../../assets/animals/penguin.png" },
      { id: "frog", name: "Frog", image: "../../assets/animals/frog.png" },
      { id: "rabbit", name: "Rabbit", image: "../../assets/animals/rabbit.png" },
      { id: "monkey", name: "Monkey", image: "../../assets/animals/monkey.png" },
      { id: "fox", name: "Fox", image: "../../assets/animals/fox.png" },
      { id: "deer", name: "Deer", image: "../../assets/animals/deer.png" },
      { id: "dog", name: "Dog", image: "../../assets/animals/dog.png" },
      { id: "cat", name: "Cat", image: "../../assets/animals/cat.png" },
      { id: "cow", name: "Cow", image: "../../assets/animals/cow.png" },
      { id: "pig", name: "Pig", image: "../../assets/animals/pig.png" },
      { id: "sheep", name: "Sheep", image: "../../assets/animals/sheep.png" },
      { id: "goat", name: "Goat", image: "../../assets/animals/goat.png" },
      { id: "chicken", name: "Chicken", image: "../../assets/animals/chicken.png" },
      { id: "duck", name: "Duck", image: "../../assets/animals/duck.png" },
      { id: "owl", name: "Owl", image: "../../assets/animals/owl.png" },
      { id: "bird", name: "Bird", image: "../../assets/animals/bird.png" },
      { id: "turtle", name: "Turtle", image: "../../assets/animals/turtle.png" },
      { id: "dinosaur", name: "Dinosaur", image: "../../assets/animals/dinosaur.png" },
    ],
  },
};

function getCategoryList() {
  return Object.values(CATEGORIES);
}
