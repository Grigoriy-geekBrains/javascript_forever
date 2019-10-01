"use strict";

const burger = new Hamburger('select[name="toppingGroup"]');
const paramOfHamburgers = [
    {size: 'Маленький', price: 50, calories: 20},
    {size: 'Большой', price: 100, calories: 40}
];
const paramOfStuffing = [
    {'name': 'С Сыром', price: 10, calories: 20},
    {'name': 'С салатом', price: 20, calories: 5},
    {'name': 'С картошкой', price: 15, calories: 10}
];
const paramOfTopping = [
    {'name': 'Приправа', price: 15, calories: 0},
    {'name': 'Майонез', price: 20, calories: 5},
];

window.addEventListener('load',function(){
    // Заполняем элементы DOM существующими данными
    document.querySelector('.hamburgers').innerHTML = `<select name="hamburgers">${fullDOM(paramOfHamburgers,'size')}</select>`;
    document.querySelector('.stuffing').innerHTML = `<select name="stuffing">${fullDOM(paramOfStuffing,'name')}</select>`;
    document.querySelector('.topping').innerHTML = `<select name="topping">${fullDOM(paramOfTopping,'name')}</select>`;

    // Создание выбранного бургера с начинкой
    document.querySelector('#choose_hamburger').addEventListener('click', function(){
        let hamburgers = document.querySelector('select[name="hamburgers"]');
        let indexHamburger = hamburgers.options[hamburgers.selectedIndex].value;
        let stuffing = document.querySelector('select[name="stuffing"]');
        let indexStuffing = stuffing.options[stuffing.selectedIndex].value;

        burger.update(paramOfHamburgers[indexHamburger],paramOfStuffing[indexStuffing]);
        document.querySelector('.menu__topping').style.visibility = 'visible';
    });

    // Добавление дополнительной начинки
    document.querySelector('#add_topping').addEventListener('click', function(){
        let topping = document.querySelector('select[name="topping"]');
        let indexTopping = topping.options[topping.selectedIndex].value;
        burger.addTopping(paramOfTopping[indexTopping]);
        showResults();
    });

    // Удаление дополнительной начинки
    document.querySelector('#remove_topping').addEventListener('click', function(){
        let indexTopping = document.querySelector('select[name="topping"]').options.selectedIndex;
        burger.removeTopping(indexTopping);
        showResults();
    });
});

//Вывод результат
function showResults(){
    let info = document.querySelector('.info');
    info.innerHTML = `Размер гамбургера: ${burger.getSize()}\n <hr>
    Основаная начинка: ${burger.getStuffing()}\n <hr>
    Дополнительные начинки: ${burger.getTopping()}\n <hr>
    Общее кол-во каллорий: ${burger.calculateCalories()}\n <hr>
    Общая стоимость: ${burger.calculatePrice()}`;
}

function fullDOM(arr,property){
    return arr.map((item,index) => {
        return `<option value="${index}">${item[property]}</option>`;
    }).join('');
}

//////////// Classes

/////  Hamburger
function Hamburger(containerForTopping){
    this.containerForTopping = document.querySelector(containerForTopping);
    this.topping = [];
    this.stuffing = null;
}

Hamburger.prototype.addTopping = function(topping){
    const newTopping = new Ingredient(topping)
    let lastindex = this.topping.push(newTopping);
    newTopping.render(lastindex-1,this.containerForTopping);
};

Hamburger.prototype.removeTopping = function(index){
    this.topping.splice(index,1);
    this.containerForTopping.remove(index);
};

Hamburger.prototype.getTopping = function(){
    return this.topping.map((topping) => {
      return topping.name;
    }).join(', ');
};

Hamburger.prototype.getSize = function(){
    return this.size;
};

Hamburger.prototype.getStuffing = function(){
    return this.stuffing.name;
};

Hamburger.prototype.calculatePrice = function(){
    return this.price + this.stuffing.getPrice() + this.topping.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.getPrice();
    },0);
};

Hamburger.prototype.calculateCalories = function(){
    return this.calories + this.stuffing.getCalories() + this.topping.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.getCalories();
    },0);
};

// Обновить данные бургера
Hamburger.prototype.update = function({price, size, calories}, ingredient){
    this.price = price;
    this.calories = calories;
    this.size = size;
    this.stuffing = new Ingredient(ingredient);
};

/////  Ingredient
function Ingredient({name, price, calories}){
    this.price = price;
    this.calories = calories;
    this.name = name;
}

Ingredient.prototype.render = function(index,container){
    let option = document.createElement('option');
    option.value = index;
    option.textContent = this.name;
    container.appendChild(option);
};

Ingredient.prototype.getPrice = function(){
    return +this.price;
};

Ingredient.prototype.getCalories = function(){
    return +this.price;
};



