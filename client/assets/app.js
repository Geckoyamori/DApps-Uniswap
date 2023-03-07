let buyMode = true;
let web3, user;
let priceData;

$(document).on("click", ".dropdown-menu li a", function () {
  let element = $(this);
  let img = element[0].firstElementChild.outerHTML;
  let text = $(this).text();
  $(".input-group .btn").html(img + text);
  $(".input-group .btn").css("color", "#fff");
  $(".input-group .btn").css("font-size", "large");
});

$(document).ready(async () => {
  // If a metamask exists in the browser
  if (window.ethereum) {
    // When using web3.js on an ethereal-enabled browser, the current native provider for that browser is set. Returns the provider given by the browser environment, otherwise returns NULL.
    web3 = new Web3(Web3.givenProvider);
  }
  // Get quotes from coingecko
  priceData = await getPrice();
  console.dir(priceData);
});

// When Connect wallet button is pressed
$(".btn.login").click(async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // accounts[0] is the connected Ethereum wallet address
    user = accounts[0];
    // update UI after connection
    // https://www.jquerystudy.info/reference/selectors/class.html
    $(".btn.login").html("Connected");
    $(".btn.swap").html("Enter an amount");
    // https://www.jquerystudy.info/reference/selectors/id.html
    $("#username").html(user);
  } catch (error) {
    alert(error.message);
  }
});

$("#swap-box").submit((e) => {
  e.preventDefault();
});

$("#arrow-box h2").click(() => {
  if (buyMode) {
    buyMode = false;
    sellTokenDisplay();
  } else {
    buyMode = true;
    buyTokenDisplay();
  }
});

async function getPrice() {
  const daiData = await (
    await fetch("https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=eth")
  ).json();

  const compData = await (
    await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=compound-governance-token&vs_currencies=eth"
    )
  ).json();

  const linkData = await (
    await fetch("https://api.coingecko.com/api/v3/simple/price?ids=chainlink&vs_currencies=eth")
  ).json();

  return {
    daiEth: daiData.dai.eth,
    linkEth: linkData.chainlink.eth,
    compEth: compData["compound-governance-token"].eth,
  };
}
