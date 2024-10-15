//Funktion för att formatera datum
export function formatPickupDate(pickupDate) {
  const localDateString = pickupDate.replace('T', ' '); //Ersätter 'T' med ett mellanslag för att tolka som lokal tid
  const date = new Date(localDateString); //Skapar ett Date-objekt från det angivna datumet

  //Formaterar datumet enligt svensk standard
  return date.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

//Funktion för att initiera "Till toppen"-knappen
export function initToTopButton() {
  const toTopBtn = document.getElementById('toTopBtn');

  window.addEventListener('scroll', () => {
    //Om användaren har skrollat mer än 100px, visa knappen; annars göm den
    toTopBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
  });

  //Vid klick på knappen scroll till toppen av sidan
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

//Funktion för att toggla dropdown-menyn
function toggleMenu() {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  if (dropdownMenu) {
    dropdownMenu.classList.toggle('open');
  }
}

//Funktion för att initiera mobilmenyn
export function initMobileMenu() {
    //Händelsehanterare för menyknappen
  const toggleButton = document.querySelector('.toggle-btn');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleMenu, false);
  }

  //Händelsehanterare för navigeringslänkar i mobilmenyn
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
  dropdownLinks.forEach((link) => {
    link.addEventListener('click', () => {
      //Stäng mobilmenyn när en länk klickas
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownMenu.classList.contains('open')) {
        dropdownMenu.classList.remove('open');
      }
    });
  });
}

//Funktion för att initiera bildkaruseller
export function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-container');

   //Loopar igenom varje karusell på sidan
  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const nextButton = carousel.querySelector('.next-button');
    const prevButton = carousel.querySelector('.prev-button');
    const slide = track.querySelector('img');

    //Om något saknas (track, knappar eller bilder), avsluta funktionen
    if (!track || !nextButton || !prevButton || !slide) return;

    //Beräkna bredden på varje bild plus marginal för att scrolla rätt avstånd
    const slideWidth = slide.offsetWidth + 10;

    //När nästa-knappen klickas, skrolla framåt med den beräknade bredden
    nextButton.addEventListener('click', () => {
      track.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    //När föregående-knappen klickas, skrolla bakåt med den beräknade bredden
    prevButton.addEventListener('click', () => {
      track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });
  });
}