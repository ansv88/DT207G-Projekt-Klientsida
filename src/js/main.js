import { checkUserAuthentication, setupLoginForm, setupLogoutButton } from './auth.js';
import { fetchAndDisplayMenu, setupMenuForm, fetchAndDisplayAdminMenu } from './menu.js';
import { fetchAndDisplayOrders, setupTakeawayForm } from './orders.js';
import { initToTopButton, initCarousel, initMobileMenu } from './utils.js';

//Huvudfunktion som körs när DOM är laddad
document.addEventListener('DOMContentLoaded', initializePage);

function initializePage() {
  initEventListeners();       //Initiera alla händelsehanterare
  checkUserAuthentication();  //Kontrollera användarens autentisering
  initToTopButton();          //Initiera "Till toppen"-knappen
  initCarousel();             // Initiera bildkarusellen

  //Om sidan är adminpage.html, hämta och visa menyn i adminpanelen
  if (window.location.pathname.includes('adminpage.html')) {
    fetchAndDisplayAdminMenu();
    fetchAndDisplayOrders(); //Hämta och visa beställningar
  } else {
    //På alla andra sidor, hämta och visa menyn för kunder
    fetchAndDisplayMenu();
  }
}

//Funktion för att initiera händelsehanterare
function initEventListeners() {
  setupLoginForm();    //Hantera inloggningsformuläret
  setupLogoutButton(); //Hantera "Logga ut"-knappen
  setupMenuForm();     //Hantera formuläret för att lägga till nya menyobjekt
  setupTakeawayForm(); //Hantera Take Away-beställningsformuläret
  initMobileMenu(); //Hantera mobilmenyn
}