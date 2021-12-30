// Declaration of constant variables
const ID_USER_HANNUN = "ID_USER_HANNUN";
const NAME_USER_HANNUN = 'NAME_USER_HANNUN';
const INITIALS_USER_HANNUN = 'INITIALS_USER_HANNUN';
const REWARDS_URL_HANNUN = 'REWARDS_URL_HANNUN';
const PROFILE_URL_HANNUN = 'PROFILE_URL_HANNUN';
const ORDERS_URL_HANNUN = 'ORDERS_URL_HANNUN';
const ADDRESSES_URL_HANNUN = 'ADDRESSES_URL_HANNUN';
const NEWSLETTER_URL_HANNUN = 'NEWSLETTER_URL_HANNUN';

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
//Show the password or not and change the icon
togglePassword.addEventListener('click', function(e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // Toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});


const buttonLogin = document.querySelector("#login");
var BASE_URL = 'https://erp.hannun.com/hannunapi/pruebahannun';

// Function processing the form and querying the API
function doLogin(event) {
    event.preventDefault();
    var userInput = document.getElementById("user").value;
    var passwordInput = document.getElementById("password").value;
    var errorText = document.getElementById("error");
    var buttonLoader = document.getElementById("buttonIn");

    // Check that the user and password are not empt
    if (userInput && passwordInput) {
        // Add loader on the button
        buttonLoader.classList.add('button--loading');
        setInterval(1000);
        //Do API call
        fetch(BASE_URL + '?user=' + userInput + '&password=' + passwordInput)
            .then(response => {
                //Remove loader when request has been processed
                buttonLoader.classList.remove("button--loading");
                if (response.ok) {
                    return response.json();
                } else {
                    throw "Error en la llamada API";
                }
            })
            .then(response => {
                buttonLoader.classList.remove("button--loading");
                if (checkError(response)) {
                    errorText.style.display = "block";
                    errorText.innerHTML = response.Error;
                    return;
                }
                saveCookies(response);    
                loadMenu();
            })
            .catch(error => {
                buttonLoader.classList.remove("button--loading");
                errorText.innerHTML = 'Problemas con el servidor. Inténtelo de nuevo más tarde.';
            });
    }
}

buttonLogin.addEventListener('submit', doLogin);

//Function that checks if the api call has had an error
function checkError(response) {
    if (response.Ok == 0) {
        return true;
    }
    return false;
}

// Functions for saving and retrieving cookies
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

// Function that stores cookies
function saveCookies(response) {
    setCookie(ID_USER_HANNUN, response.Id, 365);
    setCookie(NAME_USER_HANNUN, response.Name, 365);
    setCookie('INITIALS_USER_HANNUN', response.Initials, 365);
    setCookie('REWARDS_URL_HANNUN', response.RewardsUrl, 365);
    setCookie('PROFILE_URL_HANNUN', response.ProfileUrl, 365);
    setCookie('ORDERS_URL_HANNUN', response.OrdersUrl, 365);
    setCookie('ADDRESSES_URL_HANNUN', response.AddressesUrl, 365);
    setCookie('NEWSLETTER_URL_HANNUN', response.NewsletterUrl, 365);
}

//Function that deletes cookies 
function removeCookies() {
    setCookie(ID_USER_HANNUN, '', 0);
    setCookie(NAME_USER_HANNUN, '', 0);
    setCookie(INITIALS_USER_HANNUN, '', 0);
    setCookie(REWARDS_URL_HANNUN, '', 0);
    setCookie(PROFILE_URL_HANNUN, '', 0);
    setCookie(ORDERS_URL_HANNUN, '', 0);
    setCookie(ADDRESSES_URL_HANNUN, '', 0);
    setCookie(NEWSLETTER_URL_HANNUN, '', 0);
}

// Function that displays the menu depending on whether the user is logged in or not
function loadMenu() {
    var idCookie = getCookie(ID_USER_HANNUN);
    if (idCookie == null) {
        // Do cookie doesn't exist
        document.getElementById("login").style.display = "grid";
        document.getElementById("menu-user").style.display = "none";
    } else {
        // Do cookie exists
        var initialCookie = getCookie(INITIALS_USER_HANNUN);
        var nameCookie = getCookie(NAME_USER_HANNUN);
        var RewardsUrlCookie = getCookie(REWARDS_URL_HANNUN);
        var ProfileUrlCookie = getCookie(PROFILE_URL_HANNUN);
        var OrdersUrlCookie = getCookie(ORDERS_URL_HANNUN);
        var AddressesUrlCookie = getCookie(ADDRESSES_URL_HANNUN);
        var NewsletterUrlCookie = getCookie(NEWSLETTER_URL_HANNUN);
        var initialText = document.getElementById("initials_user");
        var nameText = document.getElementById("name_user");
        initialText.innerHTML = initialCookie;
        nameText.innerHTML = nameCookie;

        // Change menu links by url obtained in the API
        var item_menu_1 = document.getElementById("item-menu-1");
        item_menu_1.href = RewardsUrlCookie;
        var item_menu_2 = document.getElementById("item-menu-2");
        item_menu_2.href = ProfileUrlCookie;
        var item_menu_3 = document.getElementById("item-menu-3");
        item_menu_3.href = OrdersUrlCookie;
        var item_menu_4 = document.getElementById("item-menu-4");
        item_menu_4.href = AddressesUrlCookie;
        var item_menu_5 = document.getElementById("item-menu-5");
        item_menu_5.href = NewsletterUrlCookie;

        document.getElementById("login").style.display = "none";
        document.getElementById("menu-user").style.display = "block";
    }
}

// Function that clears cookies and initializes form values
function logout() {
    removeCookies();
    document.getElementById("error").style.display = "none";
    document.getElementById("password").value = "";
    document.getElementById("user").value = "";
    loadMenu();
}
