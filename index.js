const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');

const app = express();
app.use(bodyParser.json());

// Keep-alive route for UptimeRobot
app.get('/', (req, res) => {
  res.send("Bharat Yatra webhook is live!");
});

const tourPrices = {
  'goa': '₹7,000',
  'jaipur': '₹3,810',
  'taj mahal': '₹1,500',
  'char dham': '₹30,400',
  'kerala': '₹9,000',
  'ladakh': '₹20,000',
  'varanasi': '₹5,000',
  'manali': '₹6,666',
  'darjeeling': '₹8,100',
  'sikkim': '₹9,500',
  'hampi': '₹7,600',
  'rishikesh': '₹6,666',
  'udaipur': '₹5,000',
  'andaman': '₹14,300',
  'kashmir': '₹9,650'
};

function askPrice(agent) {
  let city = agent.parameters['destination'];
  if (!city) {
    agent.add("Which destination would you like to know the price for?");
    return;
  }
  city = city.toLowerCase();
  let matchedCity = Object.keys(tourPrices).find(c => city.includes(c));
  if (matchedCity) {
    agent.add(`The ${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)} tour starts at ${tourPrices[matchedCity]} per person.`);
  } else {
    agent.add(`Sorry, I don't have pricing information for ${city} right now.`);
  }
}

function askTourDuration(agent) {
  let tour = agent.parameters['destination'];
  if (!tour) {
    agent.add("Which tour would you like the duration for?");
    return;
  }
  tour = tour.toLowerCase();
  const durations = {
    'taj mahal': '2 days, 1 night',
    'char dham yatra': '10 days, 9 nights',
    'kerala': '5 days, 4 nights',
    'jaipur': '3 days, 2 nights',
    'manali': '3 days, 2 nights',
    'ladakh': '7 days, 6 nights',
    'goa': '4 days, 3 nights',
    'kashmir': '5 days, 4 nights',
    'varanasi': '3 days, 2 nights',
    'andaman': '5 days, 4 nights',
    'sikkim': '5 days, 4 nights',
    'hampi': '3 days, 2 nights',
    'rishikesh': '3 days, 2 nights',
    'darjeeling': '4 days, 3 nights',
    'udaipur': '3 days, 2 nights'
  };

  const matchedTour = Object.keys(durations).find(key => tour.includes(key) || key.includes(tour));
  if (matchedTour) {
    agent.add(`The "${matchedTour}" lasts for ${durations[matchedTour]}.`);
  } else {
    agent.add(`Sorry, I couldn't find the duration for "${tour}". Could you rephrase or specify the tour name?`);
  }
}

function askPackageDetails(agent) {
  let place = agent.parameters['destination'];
  if (!place) {
    agent.add("Please specify which tour you're asking about.");
    return;
  }
  place = place.toLowerCase();
  const packageDetails = {
    'goa': 'Includes beach resort stay, breakfast, airport pickup, and water sports activities.',
    'kerala': 'Includes houseboat cruise, meals, and guided backwater tour.',
    'ladakh': 'Includes accommodation, bikes for riders, permits, and meals.',
    'char dham': 'Includes AC transport, hotel stay, temple darshan, meals, and guide.',
    'jaipur': 'Includes heritage site tours, hotel stay, and cultural dinner.',
    'varanasi': 'Includes ghats visit, temple tour, spiritual sessions, and hotel stay.',
    'manali': 'Includes hotel, local sightseeing, adventure activities, and transport.',
    'sikkim': 'Includes guided sightseeing, hotel, permits, and meals.',
    'hampi': 'Includes heritage site entry, hotel stay, and guide.',
    'rishikesh': 'Includes rafting, camping, yoga sessions, and meals.',
    'darjeeling': 'Includes tea garden visit, toy train ride, hotel stay.',
    'udaipur': 'Includes palace visits, lake boat ride, hotel and meals.',
    'andaman': 'Includes flight transfers, beach resort stay, snorkeling tour.',
    'kashmir': 'Includes shikara ride, gulmarg tour, hotel and transport.',
    'taj mahal': 'Includes Taj entry, guide, and lunch.'
  };

  const matched = Object.keys(packageDetails).find(key => place.includes(key));
  if (matched) {
    agent.add(`Here’s what’s included in the ${matched.charAt(0).toUpperCase() + matched.slice(1)} package: ${packageDetails[matched]}`);
  } else {
    agent.add(`Sorry, I don’t have package info for "${place}" yet.`);
  }
}

app.get('/', (req, res) => {
  res.send("✅ Bharat Yatra webhook is active");
});

app.post('/', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  let intentMap = new Map();
  intentMap.set('AskPrice', askPrice);
  intentMap.set('AskTourDuration', askTourDuration);
  intentMap.set('AskPackageDetails', askPackageDetails);

  agent.handleRequest(intentMap);
});

app.listen(3000, () => console.log("✅ Server is live on port 3000"));

