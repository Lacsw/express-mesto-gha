[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)

# Проект: [Backend Mesto(Express)](https://github.com/Lacsw/express-mesto-gha)

## Описание

Данный проект представляет REST API для проекта Mesto на NodeJS с использованием фреймворка Express.
Mesto: интерактивная странца, куда пользователи могут добавлять фотографии, удалять их и ставить лайки.

Основа фронденда проекта [на чистом JS.](https://github.com/Lacsw/mesto)
И на [ReactJS.](https://github.com/Lacsw/mesto/react-mesto-auth)

## API Endpoints
| Endpoint | Request | Response |
| :---: | :---: | --- |
| `/users` | `GET` `POST` | `GET`\-запрос возвращает всех пользователей из базы данных; `POST`\-запрос создаёт пользователя с переданными в теле запроса `name`, `about`, `avatar` 
| `/users/:userId` |`GET` | `GET`\-запрос возвращает пользователя по переданному `_id`. 
| `/users/me` | `PATCH` | `PATCH`\-запрос обновляет информацию о пользователе. 
|`/users/me/avatar` |`PATCH`|`PATCH`\-запрос обновляет аватар пользователя. 
| `/cards` |`GET POST` | `GET`\-запрос возвращает все карточки из базы данных. `POST`\-запрос создает новую карточку по переданным параметрам.
| `/cards/:cardId` | `DELETE` | `DELETE`\-запрос удаляет карточку по `_id`.
| `/cards/:cardId/likes` | `PUT DELETE`| `PUT`\-запрос добавляет лайк карточке. `DELETE`\-запрос удаляет лайк с карточки.

## Технологии :computer:

- ExpressJS
- MongoDB
- Mongoose
- Nodemon
- ESlint
- Airbnb codestyle

## Как установить?

`https://github.com/Lacsw/express-mesto-gha`

В директории с проектом запустить режим разработки:

```
npm intstall

npm run start — запускает сервер
npm run dev — запускает сервер с hot-reload
```
