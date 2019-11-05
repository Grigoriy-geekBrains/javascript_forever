const express = require('express');
const fs = require('fs');
const app = express();

app.set('views', './'); // specify the views directory
app.set('view engine', 'hbs'); // register the template engine

app.listen(3000, () => {
   console.log('server is run');
});

app.use(express.static('./'));
app.use(express.json());

// Поиск товара
app.post('/search', (req, res) => {
   let query = req.body.search;
   let viewAll = req.body.viewPage;
   fs.readFile('./products.json', 'utf-8', (err, data) => {
      let goods = JSON.parse(data);
      let search = goods.filter(item => {
         const regexp = new RegExp(query, 'i');
         return regexp.test(item.caption);
      });
      if (viewAll){
         res.send(JSON.stringify({'products': search, 'count': search.length}));
      } else {
         res.send(JSON.stringify({'products': search.slice(0,3), 'count': search.length}));
      }
   });
});

/////////// Работа с каталогом //////////////
app.get('/hitsProduct', (req, res) => {
   fs.readFile('./products.json','utf-8', (err, data) => {
      let d = JSON.parse(data);
      d.filter(item => {
         return +item.hits === 1
      });
      let choosing = d.slice(0,8);
      res.send(JSON.stringify(choosing));
   });
});

app.get('/products/:page', (req, res) => {
   fs.readFile('./products.json','utf-8', (err, data) => {
      let d = JSON.parse(data);
      let page = req.params.page;
      let choosing = {};
      if (page !== 'all'){
         choosing = {
            products: d.slice(+page,+page+3),
            count: d.length
         };
      } else {
         choosing = {
            products: d,
            count: d.length
         };
      }
      res.send(JSON.stringify(choosing));
   });
});

/////////// Работа с подписчиками //////////////
app.post('/subscribe', (req, res) => {
    fs.readFile('./subscribe.json','utf-8', (err, data) => {
       let subscribe_info = JSON.parse(data);
       let email = req.body.email
       if (subscribe_info.findIndex(item => item.email === email) !== -1){
          console.log('Вы ужде подписаны');
          res.send('{"result": 0}');
          return;
       };
       let lastId = subscribe_info[subscribe_info.length-1].id;
       let newSubscribe = {
         id: lastId+1,
         email: email
       };
       subscribe_info.push(newSubscribe);
       fs.writeFile('./subscribe.json', JSON.stringify(subscribe_info), (err) => {
          if (err){
             console.log('Не удалось записать файл с прдписчиками');
             res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
       });
    });
});

/////////// Работа с корзиной //////////////
// Получение корзины
app.get('/cart', (req, res) => {
   fs.readFile('./cart.json', 'utf-8', (err, data) => {
      res.send(data);
   });
});

// Увеличение/уменьшения количества товара в корзине на 1
app.patch('/cart/:id', (req, res) => {
   fs.readFile('./cart.json', 'utf-8', (err, data) => {
      let cartData = JSON.parse(data);
      let cartIndex = cartData.findIndex(item => +item.id === +req.params.id);
      cartData[cartIndex].qty = req.body.qty;
      fs.writeFile('./cart.json', JSON.stringify(cartData), (err) => {
         (err) ? res.send('{"result": 0}') : res.send('{"result": 1}');
      });
   });
});

// Добавление нового товара в корзину
app.post('/cart', (req, res) => {
   fs.readFile('./cart.json', 'utf-8', (err, data) => {
      let cartData = JSON.parse(data);
      let item = req.body;
      cartData.push(item);
      cartData = JSON.stringify(cartData);
      fs.writeFile('cart.json', cartData, (err) => {
         (err) ? res.send('{"result": 0}') : res.send('{"result": 1}');
      });
   });
});

// Удаление товара из корзины
app.delete('/cart/:id', (req, res) => {
   fs.readFile('./cart.json', 'utf-8', (err, data) => {
      let cartData = JSON.parse(data);
      let cartIndex = cartData.findIndex(item => item.id === req.params.id);
      cartData.splice(cartIndex,1);
      fs.writeFile('./cart.json', JSON.stringify(cartData), (err) => {
         (err) ? res.send('{"result": 0}') : res.send('{"result": 1}');
      });
   });
});

// Переход на просмотр товара
app.get('/view/:id', (req, res) => {
   fs.readFile('./products.json', 'utf-8', (err, data) => {
      let productData = JSON.parse(data);
      let productIndex = productData.findIndex(item => +item.id === +req.params.id);
      res.render('single_page',{product: productData[productIndex]});
   });
});

