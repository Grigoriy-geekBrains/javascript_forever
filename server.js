const express = require('express');
const fs = require('fs');
const rs = require('fs');
const ws = require('fs');

const app = express();

app.use(express.static('./'));
app.use(express.json());

app.get('/goods', (req, res) => {
  fs.readFile('./catalog.json', 'utf-8', (err, data) => {
    res.send(data);
    writeStatus('Чтение товаров (get)',data);
  });
});

app.get('/cart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
    res.send(data);
    writeStatus('Чтение товаров из корзины (get)',data);
  });
});

app.post('/cart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
    const parsedData = JSON.parse(data);

    if(parsedData.some((item) => +item.id === +req.body.id)) {
      return res.status(500);
    }

    parsedData.push(req.body);

    fs.writeFile('./cart.json', JSON.stringify(parsedData), () => {
      res.send(req.body);
    });
    writeStatus('Добавление нового товара в корзину',JSON.stringify(req.body));
  });
});

app.patch('/cart/:id', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
    const parsedData = JSON.parse(data);

    if(parsedData.every((item) => +item.id !== +req.params.id)) {
      return res.status(500).send({});
    }

    const cartItemIdx = parsedData.findIndex((cartItem) => +cartItem.id === +req.params.id);
    parsedData[cartItemIdx].qty = req.body.qty;

    fs.writeFile('./cart.json', JSON.stringify(parsedData), () => {
      res.send(parsedData[cartItemIdx]);
    });
    writeStatus('Изменение количетсва товаров в корзине',JSON.stringify(parsedData[cartItemIdx]));
  });
});

app.delete('/cart/:id', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
    const parsedData = JSON.parse(data);

    if(parsedData.every((item) => +item.id !== +req.params.id)) {
      return res.status(500).send({});
    }

    const cartItemIdx = parsedData.findIndex((cartItem) => +cartItem.id === +req.params.id);
    parsedData.splice(cartItemIdx,1);

    fs.writeFile('./cart.json', JSON.stringify(parsedData), () => {
      res.send(parsedData[cartItemIdx]);
    });
    writeStatus('Удаление товара из корзины',JSON.stringify(parsedData[cartItemIdx]));
  });
});

app.listen(3000);

function writeStatus(message,goods){
  rs.readFile('./stats.json','utf-8', (err, data) => {
    const newData = JSON.parse(data);
    const event = {
      "action": message,
      "obj": JSON.parse(goods),
      "time": new Date()
    };
    newData.push(event);
    ws.writeFile('./stats.json',JSON.stringify(newData), () => {
      console.log(message);
    });
  });
}