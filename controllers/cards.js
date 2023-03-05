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

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );

    res.send(likedCard);
  } catch (error) {
    console.log(error);
    res.send(error.status);
    res.send(error.message);
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    res.send(likedCard);
  } catch (error) {
    console.log(error);
    res.send(error.status);
    res.send(error.message);
  }
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
