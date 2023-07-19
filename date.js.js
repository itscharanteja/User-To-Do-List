let today = new Date();
let day = "";
let options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
let out = today.toLocaleDateString("en-US", options);
