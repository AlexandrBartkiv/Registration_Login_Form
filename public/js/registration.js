
const username = document.querySelector('#name') || null;
const login = document.querySelector('#login');
const email =document.querySelector('#email');
const password = document.querySelector('#password');
const country = document.querySelector('#autoComplete');
const date = document.querySelector('#date');
const sbmt = document.querySelector('.sub');
const check = document.querySelector('#check');
const form = document.querySelector('.regForm') ;
const stamp = Math.floor(Date.now() / 1000);

//options for validator
const constrains = {
    password: {
        presence: true,
        length : {
            minimum: 6,
            message: 'must be at least 6 characters'
        }
    },
    login: {
        presence:true
    },
    email:{
        presence: true,
        email: true
    },
    name:{
        presence: true
    },
    // country:{
    //     presence:true
    // },
    date: {
        presence: true
    }
}

//fetching countries array from db
fetch('/countries')
.then(res =>res.json())
.then(data=>results = data)
.then(result => {
    //inserting our array data to dropdown
    var sel = document.getElementById("sel1");
    var options = result.countries;
    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        sel.appendChild(el);
    }
})

    


//datepicker
const picker = datepicker('.date')


//validating and submiting form

sbmt.addEventListener('click', ()=>{
    console.log('click')
    var valid = validate(form,constrains)
    var select = document.getElementById('sel1');
    var value = select.options[select.selectedIndex].text;
    console.log(value)
    //checking inputs ang checkbox
    if(!valid && check.checked){
        fetch('/registration',{      //sending form data
            method: 'post',
            headers: new Headers({'Content-Type':'application/json'}),
            body:   JSON.stringify({
                    username: username.value,
                    email: email.value, 
                    password: password.value,
                    date: date.value,
                    country: value,
                    login: login.value,
                    timestamp:stamp
                })
        })
        .then(res => res.json())
        .then(data =>{     
            console.log(data[0].email)      //login user after succesfull registration
            if(data[0].email){
                alert('register')
                    //auto login after succesfull user registration
                    setTimeout(function () {
                        fetch('/login',{
                            method: 'post',
                            headers: new Headers({'Content-Type':'application/json'}),
                            body: JSON.stringify({
                                login: login.value,
                                password: password.value
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                            const validateData = (data)=>{
                                    //saving user data to storage 
                                    sessionStorage.name = data.name;
                                    sessionStorage.email = data.email;
                                    sessionStorage.birthdate = data.birthdate;
                                    sessionStorage.country = data.country
                                    location.href='/logged';
                            }
                            validateData(data); 
                        })
                      }, 500)
                    
                    
                
            }else{
                alert('email or login already exist')
            }
        })
        
    }else{      
        if(!check.checked){
            console.log('nonchek')
            check.previousElementSibling.style.color='#ff2626';
        }                     //show user what is wrong with data in reg. form
        if(valid.password){
            password.style.background = '#ff2626';
            password.nextElementSibling.innerHTML = valid.password
        }if(valid.login){
            login.style.background = '#ff2626';
            login.nextElementSibling.innerHTML = valid.login
        }if(valid.name){
            username.style.background = '#ff2626';
            username.nextElementSibling.innerHTML = valid.name
        }if(valid.email){
            email.style.background = '#ff2626';
            email.nextElementSibling.innerHTML = valid.email
        }if(valid.date){
            date.style.background = '#ff2626';
            date.nextElementSibling.innerHTML = valid.date
        }  
    }
    

    
})
//thats need for making inputs white again after nonvalid
inpts=document.querySelectorAll('input')
inpts.forEach(inp => {
inp.addEventListener('focus', (event)=>{
    console.log('focus')
    event.target.style.background='white'
    event.target.style.border='none'
    event.target.nextElementSibling.innerHTML = ''
})
})
check.addEventListener('focus',(event)=>{
    event.target.previousElementSibling.style.color = 'white'
})

  
    
// document.addEventListener("DOMContentLoaded", () => {
//     consolee.log('111')
   
//     }
// )




//autocompleate for countries
// const autoCompleteJS = new autoComplete({
//     placeHolder: "Country",
//     data: {
//         src:
//         //get countries from db
//         async(req,res)=>{
//             const countries = await fetch('/countries')
//             .then(res =>res.json())
//             .then(data=>results = data)
//             console.log(results.countries)
//             return(results.countries)
//         } 
//         ,
//         cache: true,
//     },
//     resultItem: {
//         highlight: true
//     },
//     events: {
//         input: {
//             selection: (event) => {
//                 const selection = event.detail.selection.value;
//                 autoCompleteJS.input.value = selection;
//             }
//         }
//     }
// });