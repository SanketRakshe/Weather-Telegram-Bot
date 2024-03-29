﻿const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Weather Bot");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const bot = new TelegramBot(process.env.telegramToken, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;
  if (userInput == "/start") {
    bot.sendMessage(
      chatId,
      "Hello ❤️! Welcome to Sanket's Weather-Bot. \n\n Enter a city name."
    );
  } else {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${process.env.weatherToken}`
      );
      const data = response.data;
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15;
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = data.wind.speed;
      const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
        2
      )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

      bot.sendMessage(chatId, message);
    } catch (error) {
      bot.sendMessage(chatId, "City doesn't exist!");
    }
  }
});
