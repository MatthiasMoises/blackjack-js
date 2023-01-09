const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerPoints = 0;
let dealerPoints = 0;
let currentTurn = ''

function createDeck () {
  let deck = new Array();

  for (let i = 0; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      let card = { value: values[x], suit: suits[i] };
      deck.push(card);
    }
  }

  return deck;
}

function shuffleDeck () {
  for (let i = 0; i < 1000; i++) {
    let location1 = Math.floor((Math.random() * deck.length));
    let location2 = Math.floor((Math.random() * deck.length));
    let tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
}

function addCardElement (addedCard) {
  setTimeout(() => {
    let card = document.createElement('div');
    let value = document.createElement('div');
    let suit = document.createElement('div');

    card.className = 'card';
    value.className = 'value';
    suit.className = 'suit ' + addedCard.suit;

    value.innerHTML = addedCard.value;
    card.appendChild(value);
    card.appendChild(suit);

    if (currentTurn === 'player') {
      document.querySelector('#player-deck').appendChild(card);
    } else {
      document.querySelector('#dealer-deck').appendChild(card);
    }
  }, 250);
}

function dealCard () {
  return deck.pop()
}

function startGame () {
  resetValues();
  enableControls();

  deck = createDeck();
  shuffleDeck();

  document.querySelector('#game').style.display = 'block';

  playerTurn();
  playerTurn();
}

function playerTurn () {
  currentTurn = 'player';
  document.querySelector('#status').innerHTML = 'Player Turn';
  const card = dealCard();
  playerCards.push(card);
  addCardElement(card);
  playerPoints = calculateScore(playerCards);

  if (playerPoints >= 21) {
    gameOver();
  }
}

function dealerTurn () {
  currentTurn = 'dealer';
  document.getElementById('status').innerHTML = 'Dealer Turn';
  do {
    const card = dealCard();
    dealerCards.push(card);
    addCardElement(card);
    dealerPoints = calculateScore(dealerCards);
  } while (dealerPoints !== 21 && (dealerPoints <= playerPoints))

  gameOver();
}

function calculateScore (heldCards) {
  let sum = 0;

  for (let i = 0; i < heldCards.length; i++) {
    if (heldCards[i].value === 'J' || heldCards[i].value === 'Q' || heldCards[i].value === 'K') {
      sum += 10;
    }
    else if (heldCards[i].value === 'A' && ((sum + 11) > 21)) {
      sum += 1;
    }
    else if (heldCards[i].value === 'A' && ((sum + 11) <= 21)) {
      sum += 11;
    }
    else {
      sum += parseInt(heldCards[i].value);
    }
  }

  return sum;
}

function gameOver () {
  disableControls();
  let result = '';

  if (currentTurn === 'player') {
    if (playerPoints === 21) {
      document.querySelector('#status').style.color = 'green';
      result = 'Blackjack, you win with ' + playerPoints + ' points!';
    } else if (playerPoints > 21) {
      document.querySelector('#status').style.color = 'red';
      result = playerPoints + ', that\'s too much, you lost...';
    }
  } else {
    if (dealerPoints === 21) {
      document.querySelector('#status').style.color = 'red';
      result = 'The House wins!';
    } else if ((dealerPoints < 21 && playerPoints < 21) && (dealerPoints > playerPoints)) {
      document.querySelector('#status').style.color = 'red';
      result = 'The House wins!';
    } else if ((dealerPoints < 21 && playerPoints < 21) && (playerPoints > dealerPoints)) {
      document.querySelector('#status').style.color = 'red';
      result = 'You win with ' + playerPoints + ' points!';
    } else if ((dealerPoints < 21 && playerPoints < 21) && (playerPoints === dealerPoints)) {
      document.querySelector('#status').style.color = 'yellow';
      result = 'Draw!';
    } else if (dealerPoints > 21) {
      document.querySelector('#status').style.color = 'green';
      result = 'You win with ' + playerPoints + ' points!';
    }
  }

  document.querySelector('#status').innerHTML = result;
}

function resetValues () {
  playerCards = [];
  dealerCards = [];
  playerPoints = 0;
  dealerPoints = 0;
  document.querySelector('#player-deck').innerHTML = '';
  document.querySelector('#dealer-deck').innerHTML = '';
  document.querySelector('#status').style.color = 'white';
}

function enableControls () {
  document.querySelector('#player-turn').classList.remove('disabled');
  document.querySelector('#dealer-turn').classList.remove('disabled');
}

function disableControls () {
  document.querySelector('#player-turn').classList.add('disabled');
  document.querySelector('#dealer-turn').classList.add('disabled');
}
