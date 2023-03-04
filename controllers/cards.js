const Card = require("../models/card");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (error) {
    console.log(error);
    res.send(error.status);
    res.send(error.message);
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link, owner, likes, createdAt } = req.body;
    const newCard = await Card.create({ name, link, owner, likes, createdAt });

    res.send(newCard);
  } catch (error) {
    console.log(error);
    res.send(error.status);
    res.send(error.message);
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const deletedCard = await Card.findByIdAndDelete(cardId);

    res.send(deletedCard);
  } catch (error) {
    console.log(error);
    res.send(error.status);
    res.send(error.message);
  }
};

module.exports = { getCards, createCard, deleteCard };
