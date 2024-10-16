import { formatPickupDate } from './utils';

//URL till webbtjänst
const serverUrl = 'https://dt207g-projekt-serversida.onrender.com/api';

//Översätter kategorinamn till svenska
const categoryMap = {
  sandwiches: 'Mackor',
  salads: 'Sallader',
  hotmeals: 'Varmrätter',
  beverage: 'Kalla drycker',
  hotbeverage: 'Varma drycker',
  sweet: 'Sött',
};

//Funktion för att generera Take Away-menyn
export function generateTakeawayMenu(menuItems) {
   const sandwichesSection = document.getElementById('sandwiches-takeaway');
   const saladsSection = document.getElementById('salads-takeaway');
   const hotmealsSection = document.getElementById('hotmeals-takeaway');
   const beverageSection = document.getElementById('beverage-takeaway');
   const hotbeverageSection = document.getElementById('hotbeverage-takeaway');
   const sweetSection = document.getElementById('sweet-takeaway');
 
   //Sätt rubriker med svenska kategorinamn (categoryMap)
   if (sandwichesSection) {
     sandwichesSection.innerHTML = `<h4>${categoryMap['sandwiches']}</h4>`;
   }
   if (saladsSection) {
     saladsSection.innerHTML = `<h4>${categoryMap['salads']}</h4>`;
   }
   if (hotmealsSection) {
     hotmealsSection.innerHTML = `<h4>${categoryMap['hotmeals']}</h4>`;
   }
   if (beverageSection) {
     beverageSection.innerHTML = `<h4>${categoryMap['beverage']}</h4>`;
   }
   if (hotbeverageSection) {
     hotbeverageSection.innerHTML = `<h4>${categoryMap['hotbeverage']}</h4>`;
   }
   if (sweetSection) {
     sweetSection.innerHTML = `<h4>${categoryMap['sweet']}</h4>`;
   }
 
   //Loopa igenom menyobjekten och lägg till dem i respektive kategori
   menuItems.forEach((item) => {
     const category = item.category.trim().toLowerCase();
     const menuItem = createCheckboxMenuItem(item);
 
     //Lägg till menyobjekt i rätt kategori
     if (category === 'sandwiches' && sandwichesSection) {
       sandwichesSection.appendChild(menuItem);
     } else if (category === 'salads' && saladsSection) {
       saladsSection.appendChild(menuItem);
     } else if (category === 'hotmeals' && hotmealsSection) {
       hotmealsSection.appendChild(menuItem);
     } else if (category === 'beverage' && beverageSection) {
       beverageSection.appendChild(menuItem);
     } else if (category === 'hotbeverage' && hotbeverageSection) {
       hotbeverageSection.appendChild(menuItem);
     } else if (category === 'sweet' && sweetSection) {
       sweetSection.appendChild(menuItem);
     } else {
       console.log(`Kategori ${item.category} stöds inte.`);
     }
   });
}

//Funktion för att skapa ett menyobjekt med checkbox
function createCheckboxMenuItem(item) {
  const menuItem = document.createElement('div');
  menuItem.classList.add('menu-item'); //Lägg till en klass

  //Skapa checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `menu-item-${item._id}`; //Använd objektets ID för att identifiera checkboxen
  checkbox.name = 'order[]';
  checkbox.value = item.dishName;

  //Skapa label
  const label = document.createElement('label');
  label.htmlFor = `menu-item-${item._id}`;
  label.textContent = `${item.dishName} - ${item.price} kr`;

  //Lägg till checkbox och label till menuItem
  menuItem.appendChild(checkbox);
  menuItem.appendChild(label);

  return menuItem;
}

//Funktion för att hantera Takeaway-formuläret
export function setupTakeawayForm() {
  const takeawayForm = document.getElementById('takeaway-form');
  const fullnameErrorEl = document.getElementById('fullname-error');
  const phoneErrorEl = document.getElementById('phone-error');
  const pickupDateErrorEl = document.getElementById('date-error');
  const menuErrorEl = document.getElementById('menu-error');

  if (takeawayForm) {
    takeawayForm.addEventListener('submit', function (event) {
      event.preventDefault(); //Förhindra default-sidomladdning

      //Samla in formulärdata
      const fullname = document.getElementById('fullname').value;
      const phone = document.getElementById('phone').value;
      const pickupDate = document.getElementById('pickup-date').value;

      //Ersätt 'T' med ett mellanslag för att få en lokal datumsträng
      const localDateString = pickupDate.replace('T', ' ');
      const pickupDateObj = new Date(localDateString); //Skapa ett Date-objekt i lokal tid

      //Konvertera till ISO-sträng (UTC-tid)
      const pickupDateISO = pickupDateObj.toISOString();

      //Validera att namn fyllts i
      if (!isNaN(fullname) || fullname.trim() === '') {
        fullnameErrorEl.textContent = 'Vänligen ange ett namn';
        fullnameErrorEl.style.display = 'block'; //Visa felmeddelandet
        return;
      } else {
        fullnameErrorEl.textContent = ''; //Töm felmeddelandet om numret är giltigt
      }

      //Validera att telefonnummer endast innehåller siffror
      if (isNaN(phone) || phone.trim() === '') {
        phoneErrorEl.textContent = 'Vänligen ange ett giltigt telefonnummer (endast siffror).';
        phoneErrorEl.style.display = 'block'; //Visa felmeddelandet
        return;
      } else {
        phoneErrorEl.textContent = ''; //Töm felmeddelandet om numret är giltigt
      }

      //Validera att ett datum och en tid har valts
      if (!pickupDate) {
        pickupDateErrorEl.textContent = 'Vänligen välj en dag och tid för avhämtning.';
        return;
      } else if (!isWithinOpeningHours(new Date(pickupDate))) {
        pickupDateErrorEl.textContent = 'Beställningar kan endast göras under öppettiderna.';
        return;
      } else {
        pickupDateErrorEl.textContent = ''; //Töm felmeddelandet
      }

      //Samla in valda menyobjekt (checkboxar som är ikryssade)
      const selectedMenuItems = [];
      const checkboxes = document.querySelectorAll(
        '#menu-selection input[type="checkbox"]:checked'
      );
      checkboxes.forEach((checkbox) => {
        selectedMenuItems.push(checkbox.value); //Lägg till varje valt menyobjekt
      });

      //Validera att minst 1 maträtt är vald
      if (selectedMenuItems.length === 0) {
        menuErrorEl.textContent = 'Vänligen välj minst en maträtt.';
        menuErrorEl.style.display = 'block'; //Visa felmeddelandet
        return;
      } else {
        menuErrorEl.textContent = ''; //Töm felmeddelandet
      }

      //Skapa beställningsobjekt
      const orderData = {
        fullname,
        phone,
        pickupDate: pickupDateISO,
        items: selectedMenuItems, //Lista med valda maträtter
      };

      //Skicka beställningen till servern
      submitOrder(orderData);
    });

    //Rensa felmeddelandet när användaren börjar skriva igen
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function () {
      phoneErrorEl.textContent = ''; //Töm felmeddelandet när användaren skriver
    });
  }
}

//Funktion för att kontrollera om vald tid ligger inom öppettiderna
function isWithinOpeningHours(selectedDate) {
  const dayOfWeek = selectedDate.getDay();
  const hour = selectedDate.getHours();
  const minutes = selectedDate.getMinutes();

  //Öppettider
  const openingHours = {
    0: { open: { hour: 12, minute: 0 }, close: { hour: 17, minute: 0 } }, //Söndag
    1: null, //Måndag - Stängt
    2: null, //Tisdag - Stängt
    3: { open: { hour: 12, minute: 0 }, close: { hour: 21, minute: 0 } }, //Onsdag
    4: { open: { hour: 12, minute: 0 }, close: { hour: 21, minute: 0 } }, //Torsdag
    5: { open: { hour: 12, minute: 0 }, close: { hour: 21, minute: 0 } }, //Fredag
    6: { open: { hour: 12, minute: 0 }, close: { hour: 21, minute: 0 } }, //Lördag
  };

  const openingTimes = openingHours[dayOfWeek]; //Hämta öppettider för vald veckodag

  if (!openingTimes) {
    return false; //Om det är en stängd dag (dvs måndag och tisdag), returnera false
  }

  //Kontrollera om tiden är inom öppettiderna
  const isOpen = hour > openingTimes.open.hour ||
    (hour === openingTimes.open.hour && minutes >= openingTimes.open.minute);

  const isBeforeClose = hour < openingTimes.close.hour ||
    (hour === openingTimes.close.hour && minutes <= openingTimes.close.minute);

  return isOpen && isBeforeClose; //Returnera om tiden är inom öppettiderna
}

//Funktion för att skicka takeaway-beställningen
export function submitOrder(orderData) {
  const successMessageEl = document.getElementById('success-message-order');

  //Skicka beställningen till servern
  fetch(`${serverUrl}/projektdt207g/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData), //Omvandla beställningsobjektet till JSON
  })
    .then((response) => response.json())
    .then((data) => {
         //Visa meddelande att beställningen lyckades
         successMessageEl.textContent = 'Tack för din beställning!';
         successMessageEl.classList.add('visible');

      //Återställ formuläret
      document.getElementById('takeaway-form').reset();

      //Dölj bekräftelsemeddelandet efter 5 sekunder
      setTimeout(() => {
        successMessageEl.style.display = 'none';
      }, 5000);
    })
    .catch((error) => {
      console.error('Fel vid skickande av beställning:', error);
    });
}

//Funktion för att hämta beställningar (för admin)
export function fetchAndDisplayOrders() {
  const token = sessionStorage.getItem('jwtToken'); //Hämta JWT-token för autentisering

  //Hämta beställningar från servern
  fetch(`${serverUrl}/projektdt207g/orders`, {
    headers: {
      Authorization: `Bearer ${token}`, //Skicka token
    },
  })
    .then((response) => response.json())
    .then((orders) => {
      displayOrders(orders); //Visa beställningarna
    })
    .catch((error) => {
      console.error('Fel vid hämtning av beställningar:', error);
    });
}

//Funktion för att visa beställningar (för admin)
function displayOrders(orders) {
  const ordersContainer = document.getElementById('orders-container');
  ordersContainer.innerHTML = ''; //Töm innehållet i beställningscontainern

  orders.forEach((order) => {
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order-item'); //Lägg till klass för beställningsobjekt

    //Skapa lista med beställda maträtter
    const itemsList = order.items.map((item) => `<li>${item}</li>`).join(''); 

    //Skriv ut beställningsdetaljer i order-diven
    orderDiv.innerHTML = `
        <p><strong>Namn:</strong> ${order.fullname}</p>
        <p><strong>Telefon:</strong> ${order.phone}</p>
        <p><strong>Avhämtningstid:</strong> ${formatPickupDate(order.pickupDate)}</p>
        <p><strong>Beställning:</strong></p>
        <ul>${itemsList}</ul>
        <div class="order-actions">
        <button class="complete-order-button" data-id="${order._id}">Utfört</button>
        </div>
        `;

    ordersContainer.appendChild(orderDiv);
  });

  //Lägg till event listeners för "Utfört"-knapparna
  const completeButtons = document.querySelectorAll('.complete-order-button');
  completeButtons.forEach((button) => {
    button.addEventListener('click', handleCompleteOrder);
  });
}

//Funktion för att hantera när en beställning markeras som "Utförd"
function handleCompleteOrder(event) {
  const orderId = event.target.getAttribute('data-id');  //Hämta order-id
  const token = sessionStorage.getItem('jwtToken'); //Hämta JWT-token

  //Ta bort beställningen från servern via DELETE-anrop
  fetch(`${serverUrl}/projektdt207g/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`, //Skicka token för autentisering
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log('Beställning borttagen');
        //Uppdatera beställningslistan
        fetchAndDisplayOrders();
      } else {
        console.error('Fel vid borttagning av beställning');
      }
    })
    .catch((error) => {
      console.error('Fel vid DELETE-anrop:', error);
    });
}