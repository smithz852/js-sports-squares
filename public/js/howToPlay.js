console.log("howToPlay.js loaded");

const howToPlay = async (event) => {
  event.preventDefault();
  console.log("How To Play button clicked");
  const response = await fetch("/home-routes.js", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    document.location.replace("/howToPlay");
  } else {
    alert("How to Play page not found");
  }
};

const howToPlayBtn = document.querySelector("#howToPlayBtn");
console.log(howToPlayBtn);
if (howToPlayBtn) {
  howToPlayBtn.addEventListener("click", howToPlay);
} else {
  console.error("How To Play button not found");
}
