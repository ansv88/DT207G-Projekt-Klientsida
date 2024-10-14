//URL till webbtjänst
const serverUrl = 'https://dt207g-projekt-serversida.onrender.com/api';

//Funktion för att kontrollera användarens autentisering
export function checkUserAuthentication() {
    const token = sessionStorage.getItem('jwtToken');  //Hämtar JWT-token från sessionStorage
  
    //Om token finns och man är på adminlogin.html, omdirigera till adminpage.html
    if (token && window.location.pathname.includes('adminlogin.html')) {
      window.location.href = 'adminpage.html';
      return;
    }
  
    //Skydda adminpage.html om det behövs
    if (window.location.pathname.includes('adminpage.html')) {
      protectAdminPage(token);
    }
  }
  
  //Funktion för att skydda(dölja) admin-sidan
  function protectAdminPage(token) {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('hidden');
    }
  
     //Om token saknas, omdirigera till inloggningssidan
    if (!token) {
      window.location.href = 'adminlogin.html';
    } else {
      if (mainContent) {
        mainContent.classList.remove('hidden'); //Om token finns, visas innehållet
      }
    }
  }
  
  //Funktion för att hantera inloggningsformuläret
  export function setupLoginForm() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
      //Hantera formulärets 'submit'-händelse
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); //Förhindra default-sidomladdning
  
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        //Om användarnamn eller lösenord är tomt, visa ett felmeddelande
        if (!username || !password) {
          document.getElementById('login-error').textContent =
            'Vänligen fyll i både användarnamn och lösenord.';
          return;
        }
  
        loginUser(username, password);
      });
  
      //Rensa felmeddelande när användaren börjar skriva
      const loginInputs = loginForm.querySelectorAll('input');

      loginInputs.forEach((input) => {
        input.addEventListener('input', function () {
          document.getElementById('login-error').textContent = '';
        });
      });
    }
  }
  
//Funktion för att logga in användaren
async function loginUser(username, password) {
    const userData = { username, password }; //Skapar ett objekt med inloggningsdata
  
    try {
      const response = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),  //Omvandlar inloggningsdata till en JSON-sträng för att skicka till servern
      });
  
      if (!response.ok) {
        throw new Error(`Ett fel uppstod: ${response.status} ${response.statusText}`);
      }
  
      const responseData = await response.json(); //Parsar svaret från servern som JSON
      const token = responseData.response.token; //Hämtar JWT-token från svaret
  
      sessionStorage.setItem('jwtToken', token); //Sparar token i sessionStorage
      window.location.href = 'adminpage.html'; //Omdirigerar till admin-sidan när inloggningen lyckas
    } catch (error) {
      console.error('Error:', error);
      const errorEl = document.getElementById('login-error');
      if (errorEl) {
        errorEl.textContent = 'Fel användarnamn och/eller lösenord. Vänligen försök igen.';
      }
    } 
  }

  //Funktion för att hantera "Logga ut"-knappen
  export function setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', function () {
        sessionStorage.removeItem('jwtToken'); //Tar bort JWT-token från sessionStorage
        window.location.href = 'adminlogin.html'; //Omdirigerar till inloggningssidan efter utloggning
      });
    }
  }