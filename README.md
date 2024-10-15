# Beppes Strandkafé - Klientsida för webbapplikation
Det här repot innehåller källkoden för klientsidan av Beppes Strandkafés webbapplikation. Applikationen ger användare möjlighet att:

- Visa öppettider och läsa om kaféet.
- Se menyn som laddas dynamiskt från serversidan via AJAX-förfrågningar.
- Göra take away-beställningar direkt från webbplatsen.
- Administratörer kan logga in för att nå en skyddad adminsida där de kan hantera beställningar och redigera menyn.

Applikationen är byggd med HTML, SCSS och JavaScript, och kommunicerar med en REST-webbtjänst på serversidan.

## Funktioner
- **Dynamisk menyvisning:** Menyn laddas dynamiskt från serversidan.
- **Take Away-beställningar:** Användare kan göra beställningar för avhämtning.
- **Administratörsinloggning:** Skyddad inloggningssida för administratörer.
- **Adminsida:** Administratörer kan se inkomna beställningar och redigera menyn.
- **Responsiv design:** Webbplatsen fungerar för både mobila enheter och desktops.

## Länkar
- **Klientsida (live):** [https://dt207g-projekt-klientsida.onrender.com](https://dt207g-projekt-klientsida.onrender.com)

- **Serversida API (live):** [https://dt207g-projekt-serversida.onrender.com](https://dt207g-projekt-serversida.onrender.com)

- **Serversidans repo:** [https://github.com/ansv88/DT207G-Projekt-Serversida.git](https://github.com/ansv88/DT207G-Projekt-Serversida.git)

## Installation och Konfiguration
Klona källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket. Starta utvecklingsservern med kommando npm run start.

## Beroenden
-**Parcel:** För paketering och byggprocess.
-**SCSS:** För CSS-hantering.
-**Google Fonts:** För typsnitt.
-**Font Awesome:** För ikoner.

## Användning
 ### index.html
 Startsidan för Beppes Strandkafé där besökare kan:
- Se öppettider och lära sig mer om kaféet.
- Bläddra igenom menyn som laddas dynamiskt från serversidan.
- Göra en take away-beställning via ett formulär.
- Navigera till olika sektioner via menyn.
- Använda "Till toppen"-knappen för snabb navigering.
- Nå adminlogin.html via länk i footern

 ### adminlogin.html
Inloggningssida för redan registrerade användare. Användarnamn och lösenord ska fyllas i. Vid korrekt autentisering skickas användaren vidare till adminpage.html

 ### adminpage.html
 Skyddad adminsida för hantering av kaféet:
- Visa en lista över inkomna take away-beställningar.
- Lägg till nya menyobjekt via ett formulär.
- Redigera eller ta bort befintliga menyobjekt.
- Logga ut-knapp för att avsluta sessionen.

## Autentisering
För att komma åt skyddade resurser på adminsidan krävs inloggning med giltiga användaruppgifter. Efter lyckad inloggning lagras en JWT-token i sessionStorage, som sedan används för att autentisera förfrågningar till serversidan.