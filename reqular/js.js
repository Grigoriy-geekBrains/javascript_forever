"use strict";

window.addEventListener('load',init);

function replaceInText(){
    let text = `The engineer turned, astonished. Her question had sounded like an order, 
not like the amateur curiosity of a passenger. She stood, hands in pockets, 
coat collar raised, the wind beating her hair in strands across her face. 
'Red light, lady,' he said, pointing up with his thumb. 
'How long has it been on?' 
'An hour . ' 
'We're off the main track, aren't we?' 
'That's right.' 
'Why?' 
'I don't know.' 
The conductor spoke up. 'I don't think we had any business being sent off 
on a siding, that switch wasn't working right, and this thing's not working 
at all.' He jerked his head up at the red light. 'I don't think the signal's 
going to change. I think it's busted.' 
'Then what are you doing?' 
'Waiting for it to change.' 
In her pause of startled anger, the fireman chuckled. 'Last week, the 
crack special of the Atlantic Southern got left on a siding for two hours- 
just somebody's mistake.' 
'This is the Taggart Comet,' she said. 'The Comet has never been late.' 
'She's the only one in the country that hasn't,' said the engineer. 
'There's always a first time,' said the fireman. 
'You don't know about railroads, lady,' said a passenger. 
'There's not a signal system or a dispatcher in the country that's worth a 
damn . ' 
She did not turn or notice him, but spoke to the engineer. 
'If you know that the signal is broken, what do you intend to do?' 
He did not like her tone of authority, and he could not understand why she 
assumed it so naturally. She looked like a young girl; only her mouth and 
eyes showed that she was a woman in her thirties. The dark gray eyes were 
direct and disturbing, as if they cut through things, throwing the 
inconsequential out of the way. The face seemed faintly familiar to him, but 
he could not recall where he had seen it. 
'Lady, I don't intend to stick my neck out,' he said. 
'He means,' said the fireman, 'that our job's to wait for orders.' 
'Your job is to run this train.' 
'Not against a red light. If the light says stop, we stop.'`;

    let reg = /'[^t]/gm;
    let res = text.replace(reg,'"');
    console.log(res)
}


function init(){
    const form = document.querySelector('.form');
    document.querySelector('input[type="submit"]').addEventListener('click',(event) => sendForm(event));
}

function validationField(reg,field){
    if (!reg.test(field.value)){
        field.classList.add('error');
        document.querySelector('.errorText').textContent = 'Ошибочка вышла';
    }
}

function sendForm(event){
    event.preventDefault();
    const checkName = /^[A-zА-яё]+$/i;
    const checkPhone = /\+7\(\d{3}\)\d{3}-\d{4}/;
    const checkEmail = /^[A-z.\-0-9]+@mail\.ru$/i;

    document.querySelectorAll('input[type="text"]').forEach((element) => {
       element.classList.remove('error');
    });
    document.querySelector('.errorText').textContent = '';

    let nameField = document.querySelector('#name');
    let phoneField = document.querySelector('#phone');
    let emailField = document.querySelector('#email');
    validationField(checkName,nameField);
    validationField(checkPhone,phoneField);
    validationField(checkEmail,emailField);
}














