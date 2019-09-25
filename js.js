"use strict";

window.addEventListener('load', () => {
    const list = new GoodsList();
    list.fetchFoods();
    list.render();
    list.getSumPriceOfGoods();
});

// const goods = [
//     {title: 'Shirt',},
//     {title: 'Socks', price: 50},
//     {title: 'Jacket', price: 350},
//     {title: 'Shoes', price: 250},
// ];
//
// const renderList = (items) => {
//     const renderedGoods = items.map(renderItem).join('');
//
//     document.querySelector('.catalog').innerHTML = renderedGoods;
// };
//
// const renderItem = ({title, price = "1"}) => {
//     return `<div class="item">
//                 <div class="item__img"> <img class="item__img_pic" src="pic.png" alt="#"></div>
//                 <h3 class="item__caption">${title}</h3>
//                 <div class="item__box">
//                     <p class="item__price">Цена: $${price}</p>
//                     <a href="#" class="item__addToCart">Добавить</a>
//                 </div>
//             </div>`;
// };

class GoodsItem{
    constructor(title,price){
        this.title = title;
        this.price = price;
    }
    render(){
        return `<div class="item">
                    <div class="item__img"> <img class="item__img_pic" src="pic.png" alt="#"></div>
                    <h3 class="item__caption">${this.title}</h3>
                    <div class="item__box">
                        <p class="item__price">Цена: $${this.price}</p>
                        <a href="#" class="item__addToCart">Добавить</a>
                    </div>
                </div>`;
    }
}

class GoodsList{
    constructor(){
        this.goods = [];
    }
    fetchFoods(){
        this.goods = [
            {title: 'Shirt', price: 150},
            {title: 'Socks', price: 50},
            {title: 'Jacket', price: 350},
            {title: 'Shoes', price: 250},
        ];
    }
    render(){
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.catalog').innerHTML = listHtml;
    }
    getPriceGoods(item){
        return +item.price;
    }
    getSumPriceOfGoods(){
        let sum = 0;
        for (let n = 0; n < this.goods.length; n++){
            sum += this.goods[n].price;
        }
        return sum;
    }
}

class Cart{
    constructor(){

    }
    getGoods(){

    }
    getSumPrice(){

    }
    removeGoods(){

    }
    addGoods(){

    }
    render(){

    }
}

class CartItem{
    constructor(props){

    }
    render(){

    }
}








