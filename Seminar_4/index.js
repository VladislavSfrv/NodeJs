const express = require('express');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const app = express();

let uniqueID = 1;

const userSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    secondName: Joi.string().min(10).required(),
    age: Joi.number().min(0).required(),
    city: Joi.string().min(2),
})

const usersListPath = path.join(__dirname, '/users.json');
app.use(express.json());

// app.use((req, res) => {
//     res.status(404).send({
//         message: 'URL not found'
//     })
// })

/***
 * Получить всех пользователей
 */
app.get('/users', (req, res) => {
    const usersJSON = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJSON);
    res.send({ users: usersData});
})

/**
 * Получить данные конкретного юзера
 */

app.get('/users/:id', (req, res) => {
    const usersJSON = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJSON);

    const user = usersData.find((user) => user.id === Number(req.params.id));

    if(user){
        res.send({ user });
    }else{
        res.status(404);
        res.send({ user : null, message : "Пользователь не найден"});
    }
})

/**
 * Создание нового пользователя
 */

app.post('/users', (req, res) => {
    const validateData = userSchema.validate(req.body);
    if (validateData.error) {
        return res.status(400).send({error: validateData.error.details});
    }
    const usersJSON = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJSON);

    uniqueID += 1;

    usersData.push({
        id: uniqueID,
        ...req.body //rest and spread
    })

    fs.writeFileSync(usersListPath, JSON.stringify(usersData));

    res.send({
        id: uniqueID
    })
})

/**
 * Обновление пользователей
 */

app.use('/users/:id', (req, res) => {
    const usersJSON = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJSON);

    const validateData = userSchema.validate(req.body);
    if (validateData.error) {
        return res.status(400).send({error: validateData.error.details});
    }

    const user = usersData.find((user) => user.id === Number(req.params.id));

    if(user){
        user.firstName = req.body.firstName;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;  
        fs.writeFileSync(usersListPath, JSON.stringify(usersData));

        res.send({ user });
    }else{
        res.status(404);
        res.send({ user: null,
                   message: "Пользователь не найден"
        })
    }
})

/**
 * Удаление пользователя
 */

app.delete('/users/:id', (req, res) => {
    const usersJSON = fs.readFileSync(usersListPath, 'utf-8');
    const usersData = JSON.parse(usersJSON);

    const userIndex = usersData.findIndex((user) => user.id === Number(req.params.id));

    if (usersIndex > -1) {
        usersData.splice(userIndex, 1);
        fs.writeFileSync(usersListPath, JSON.stringify(usersData));

        res.send({ message: "Пользователь успешно удален"});
    }else{
        res.status(404);
        res.send({ message: "Пользователь не найден"});
    }
})

/**
 * Запуск локального сервера
 */
const port = 3000;

app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`)
})