import { generateTakeawayMenu } from './orders';

//URL till webbtjänst
const serverUrl = 'https://dt207g-projekt-serversida.onrender.com/api';

//Översätter kategorinamn till svenska
const categoryMap = {
  sandwiches: 'Mackor',
  salads: 'Sallader',
  hotmeals: 'Varmrätter',
  beverage: 'Drycker',
};

//Funktion för att hämta och visa menyobjekt
export function fetchAndDisplayMenu() {
  //Visa laddningsanimation
  const menuLoader = document.querySelector('#menu-content .loader');
  if (menuLoader) {
    menuLoader.style.display = 'block';
  }

  //Hämta menyobjekt från api
  fetch(`${serverUrl}/projektdt207g/menuitems`)
    .then((response) => response.json())
    .then((data) => {
      //Dölj laddningsanimation när data har hämtats
      if (menuLoader) {
        menuLoader.style.display = 'none';
      }

      //Visa menyobjekt om data finns
      if (data && data.length > 0) {
        displayMenuItems(data);
      } else {
        console.log('Inga menyobjekt hittades');
      }
    })
    .catch((error) => {
      //Dölj laddningsanimationen även vid fel
      if (menuLoader) {
        menuLoader.style.display = 'none';
      }
      console.error('Fel vid hämtning av menyobjekt:', error);
    });
}

//Funktion för att visa menyobjekt i både vanliga menysektionen och takeaway-sektion
export function displayMenuItems(menuItems) {
  displayMenuByCategory(menuItems); //Visa vanliga menyn
  generateTakeawayMenu(menuItems); //Visa takeaway-menyn
}

//Funktion för att visa menyn och gruppera efter kategori
export function displayMenuByCategory(menuItems) {
  const sandwichesSection = document.getElementById('sandwiches');
  const saladsSection = document.getElementById('salads');
  const hotmealsSection = document.getElementById('hotmeals');
  const beverageSection = document.getElementById('beverage');

  //Om inga sektioner finns, avsluta funktionen
  if (!sandwichesSection && !saladsSection && !hotmealsSection && !beverageSection) {
    return;
  }

  //Sätt rubriker med svenska kategorinamn (categoryMap)
  if (sandwichesSection) {
    sandwichesSection.innerHTML = `<h3>${categoryMap['sandwiches']}</h3>`;
  }
  if (saladsSection) {
    saladsSection.innerHTML = `<h3>${categoryMap['salads']}</h3>`;
  }
  if (hotmealsSection) {
    hotmealsSection.innerHTML = `<h3>${categoryMap['hotmeals']}</h3>`;
  }
  if (beverageSection) {
    beverageSection.innerHTML = `<h3>${categoryMap['beverage']}</h3>`;
  }

  //Loopa igenom menyobjekten och lägg till dem i respektive kategori
  menuItems.forEach((item) => {
    const category = item.category.trim().toLowerCase();
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    menuItem.innerHTML = `<p>${item.dishName} - ${item.price} kr<br>Ingredienser: ${item.ingredients}</p>`;

    //Lägg till objekt i rätt kategori
    if (category === 'sandwiches' && sandwichesSection) {
      sandwichesSection.appendChild(menuItem);
    } else if (category === 'salads' && saladsSection) {
      saladsSection.appendChild(menuItem);
    } else if (category === 'hotmeals' && hotmealsSection) {
      hotmealsSection.appendChild(menuItem);
    } else if (category === 'beverage' && beverageSection) {
      beverageSection.appendChild(menuItem);
    } else {
      console.log(`Kategori ${item.category} stöds inte.`);
    }
  });
}

//Funktion för att hämta och visa menyobjekt i adminpanelen
export function fetchAndDisplayAdminMenu() {
  const token = sessionStorage.getItem('jwtToken');

  fetch(`${serverUrl}/projektdt207g/menuitems`, {
    headers: {
      Authorization: `Bearer ${token}`, //Skicka JWT-token för autentisering
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        displayAdminMenuItems(data);
      } else {
        console.log('Inga menyobjekt hittades');
      }
    })
    .catch((error) => {
      console.error('Fel vid hämtning av menyobjekt:', error);
    });
}

//Funktion för att visa menyobjekt i adminpanelen med redigera- och ta bort-alternativ
function displayAdminMenuItems(menuItems) {
  const adminMenuItemsContainer = document.getElementById('admin-menu-items');
  adminMenuItemsContainer.innerHTML = '';

  menuItems.forEach((item) => {
    const menuItemDiv = document.createElement('div');
    menuItemDiv.classList.add('admin-menu-item');

    //Översätt kategorin till svenska för visning
    const categorySwedish = categoryMap[item.category.trim().toLowerCase()] || item.category;

    menuItemDiv.innerHTML = `
        <div class="menu-item-view">
          <p><strong>${item.dishName}</strong> - ${item.price} kr</p>
          <p>Ingredienser: ${item.ingredients}</p>
          <p>Kategori: ${categorySwedish}</p>
          <button class="edit-button" data-id="${item._id}">Redigera</button>
          <button class="delete-button" data-id="${item._id}">Ta bort</button>
        </div>
      `;

    adminMenuItemsContainer.appendChild(menuItemDiv);
  });

  //Lägg till event listeners för redigera- och ta bort-knapparna
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach((button) => {
    button.addEventListener('click', editMenuItem);
  });

  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', deleteMenuItem);
  });
}

//Funktion för att hantera formuläret för att lägga till eller uppdatera maträtter
export function setupMenuForm() {
  const menuForm = document.getElementById('menuForm');
  const successMessage = document.getElementById('success-message');

  if (menuForm) {
    menuForm.addEventListener('submit', function (event) {
      event.preventDefault(); //Förhindra default-sidomladdning


      const dishName = document.querySelector('input[name="dishName"]').value;
      const ingredients = document.querySelector('input[name="ingredients"]').value;
      const price = document.querySelector('input[name="price"]').value;
      const category = document.querySelector('select[name="category"]').value;

      const menuItemData = { dishName, ingredients, price, category };
      const token = sessionStorage.getItem('jwtToken');
      const editId = menuForm.getAttribute('data-edit-id'); //Kolla om ett objekt ska uppdateras

      //Kolla om ett menyojekt ska uppdateras eller skapas
      if (editId) {
        updateMenuItem(editId, menuItemData, token, successMessage, menuForm);
      } else {
        createMenuItem(menuItemData, token, successMessage, menuForm);
      }
    });
  }
}

//Funktion för att skapa nytt menyobjekt
function createMenuItem(menuItemData, token, successMessage, menuForm) {
  fetch(`${serverUrl}/projektdt207g/menuitems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, //Skickar JWT-token för autentisering
    },
    body: JSON.stringify(menuItemData), //Skickar data som JSON
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error('Fel vid skapande av maträtt:', data.error);
      } else {
         //Visa meddelande att det lyckades och återställ formuläret
        successMessage.textContent = `Maträtten '${data.dishName}' har lagts till i menyn!`;
        successMessage.classList.add('visible');

        menuForm.reset();

        //Uppdatera menylistan på adminsidan
        fetchAndDisplayAdminMenu();

        //Meddelandet slutar visas efter 5 sekunder
        setTimeout(() => {
          successMessage.classList.remove('visible');
        }, 5000);
      }
    })
    .catch((error) => {
      console.error('Fel vid POST-anrop:', error);
    });
}

//Funktion för att uppdatera befintligt menyobjekt
function updateMenuItem(editId, menuItemData, token, successMessage, menuForm) {
  fetch(`${serverUrl}/projektdt207g/menuitems/${editId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, //Skickar JWT-token för autentisering
    },
    body: JSON.stringify(menuItemData), //Skickar uppdaterad data som JSON
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error('Fel vid uppdatering av maträtt:', data.error);
      } else {
         //Visa meddelande att det lyckades och återställ formuläret
        successMessage.textContent = `Maträtten '${data.dishName}' har uppdaterats!`;
        successMessage.classList.add('visible');

        menuForm.reset();
        menuForm.removeAttribute('data-edit-id'); //Ta bort redigerings-ID
        menuForm.querySelector('button[type="submit"]').textContent = 'Lägg till maträtt';

        //Uppdatera menylistan på adminsidan
        fetchAndDisplayAdminMenu();

        //Meddelandet slutar visas efter 5 sekunder
        setTimeout(() => {
          successMessage.classList.remove('visible');
        }, 5000);
      }
    })
    .catch((error) => {
      console.error('Fel vid PUT-anrop:', error);
    });
}

//Funktion för redigering av menyobjekt
function editMenuItem(event) {
  const menuItemId = event.target.getAttribute('data-id');
  const token = sessionStorage.getItem('jwtToken');

  //Hämta aktuell data för menyobjektet
  fetch(`${serverUrl}/projektdt207g/menuitems/${menuItemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((item) => {
      //Fyll i formuläret med aktuell data
      document.querySelector('input[name="dishName"]').value = item.dishName;
      document.querySelector('input[name="ingredients"]').value = item.ingredients;
      document.querySelector('input[name="price"]').value = item.price;
      document.querySelector('select[name="category"]').value = item.category;

      //Sätter formuläret i "redigeringsläge" genom att spara ID och ändra knappen till "Uppdatera maträtt"
      const menuForm = document.getElementById('menuForm');
      menuForm.setAttribute('data-edit-id', menuItemId); //Sparar ID för att uppdatera senare
      menuForm.querySelector('button[type="submit"]').textContent = 'Uppdatera maträtt'; //Ändrar knapptext
    })
    .catch((error) => {
      console.error('Fel vid hämtning av menyobjekt för redigering:', error);
    });
}

//Funktion för borttagning av menyobjekt
function deleteMenuItem(event) {
  const menuItemId = event.target.getAttribute('data-id');
  const token = sessionStorage.getItem('jwtToken');

  if (confirm('Är du säker på att du vill ta bort denna maträtt?')) {
    fetch(`${serverUrl}/projektdt207g/menuitems/${menuItemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Maträtt borttagen');
          //Uppdatera menylistan
          fetchAndDisplayAdminMenu();
        } else {
          console.error('Fel vid borttagning av maträtt');
        }
      })
      .catch((error) => {
        console.error('Fel vid DELETE-anrop:', error);
      });
  }
}