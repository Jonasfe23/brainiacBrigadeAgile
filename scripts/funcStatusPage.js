
function leveransdatum(ordernr) {
  // Här skulle din logik för att hämta leveransdatumet baserat på ordernumret vara
  // Vi använder här ett hårdkodat leveransdatum för detta exempel
  var leverans = {
    "12345": new Date("2024-03-25"),  // Leveransdatum för ordernummer 12345
    "67890": new Date("2024-03-20"),   // Leveransdatum för ordernummer 67890
    "54321": new Date("2024-04-01")    // Leveransdatum för ordernummer 54321
  };
  return leverans[ordernr];
}

function beraknaTid() {
  var ordernr = document.getElementById("ordernr").value;
  var leverans = leveransdatum(ordernr);
  var idag = new Date();
  
  var tidKvar = leverans - idag; // Tiden kvar till leverans i millisekunder

  var dagarKvar = Math.floor(tidKvar / (1000 * 60 * 60 * 24)); // Antal dagar kvar

  var resultatElement = document.getElementById("resultat");
  if (leverans) {
    if (tidKvar < 0) {
      resultatElement.textContent = "Din order är redan klar!";
    } else {
      resultatElement.textContent = "Det är " + dagarKvar + " dagar kvar till din order är klar";
    }
  } else {
    resultatElement.textContent = "Ordernumret hittades inte";
  }
}


