
// ELGIE'S WONDERS - PANIER MULTI-PRODUITS

const numeroWhatsApp = "237694604440";

let panier = JSON.parse(localStorage.getItem("elgiesPanier")) || [];

// Afficher le montant en FCFA
function formaterPrix(prix) {
    return prix.toLocaleString("fr-FR") + " FCFA";
}

// Ajouter un produit au panier
function ajouterAuPanier(produit, prix) {
    const article = panier.find(item => item.nom === produit);

    if (article) {
        article.quantite++;
    } else {
        panier.push({
            nom: produit,
            prix: prix,
            quantite: 1
        });
    }

    afficherPanier();
    alert(produit + " ajouté au panier !");
}

// Afficher le contenu du panierS
function afficherPanier() {

    localStorage.setItem("elgiesPanier", JSON.stringify(panier));

    const contenu = document.getElementById("panier-contenu");
    const totalElement = document.getElementById("panier-total");

    contenu.innerHTML = "";

    if (panier.length === 0) {
        contenu.textContent = "Votre panier est actuellement vide.";
        totalElement.textContent = "0 FCFA";
        return;
    }

    let total = 0;

    panier.forEach((article, index) => {
        const sousTotal = article.prix * article.quantite;
        total += sousTotal;

        
const ligne = document.createElement("div");
ligne.className = "ligne-panier";

const description = document.createElement("span");
description.textContent =
    article.nom + " x " + article.quantite +
    " = " + formaterPrix(sousTotal);

const diminuer = document.createElement("button");
diminuer.textContent = "−";
diminuer.addEventListener("click", () => {
    article.quantite--;

    if (article.quantite <= 0) {
        panier.splice(index, 1);
    }

    afficherPanier();
});

const augmenter = document.createElement("button");
augmenter.textContent = "+";
augmenter.addEventListener("click", () => {
    article.quantite++;
    afficherPanier();
});

const supprimer = document.createElement("button");
supprimer.textContent = "Retirer";
supprimer.addEventListener("click", () => {
    panier.splice(index, 1);
    afficherPanier();
});

ligne.appendChild(description);
ligne.appendChild(diminuer);
ligne.appendChild(augmenter);
ligne.appendChild(supprimer);

contenu.appendChild(ligne);

    });

    totalElement.textContent = formaterPrix(total);
}

// Détecter les clics sur les produits
document.querySelectorAll(".produit button").forEach(bouton => {
    bouton.textContent = "Ajouter au panier";

    bouton.addEventListener("click", () => {
        const produit = bouton.closest(".produit");
        const nom = produit.querySelector("h3").textContent;
        const prixTexte = produit.querySelector("strong").textContent;
        const prix = Number(prixTexte.replace(/\D/g, ""));

        ajouterAuPanier(nom, prix);
    });
});

// Vider le panier
document.getElementById("vider-panier").addEventListener("click", () => {
    panier = [];
    afficherPanier();
});

// Commander sur WhatsApp
document.getElementById("commander-panier").addEventListener("click", () => {

    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const choix = prompt(
        "Choisissez votre mode de réception :\n\n" +
        "1 - Livraison\n" +
        "2 - Retrait sur place"
    );

    if (choix !== "1" && choix !== "2") {
        alert("Choix invalide.");
        return;
    }

    const mode = choix === "1" ? "Livraison" : "Retrait sur place";
// Récupérer les informations du client
const nom = document.getElementById("nom-client").value.trim();
const telephone = document.getElementById("telephone-client").value.trim();
const adresse = document.getElementById("adresse-client").value.trim();
const instructions = document.getElementById("instructions-client").value.trim();
const paiement = document.getElementById("mode-paiement").value;
// Vérifier les informations obligatoires
if (!nom || !telephone) {
    alert("Veuillez renseigner votre nom et votre téléphone.");
    return;
}
if (!paiement) {
    alert("Veuillez choisir un mode de paiement.");
    return;
}
if (mode === "Livraison" && !adresse) {
    alert("Veuillez renseigner votre adresse de livraison.");
    return;
}
    let total = 0;
    let message = "Bonjour ELGIE'S WONDERS !\n\n";

message += "INFORMATIONS DU CLIENT\n";
message += "Nom : " + nom + "\n";
message += "Téléphone : " + telephone + "\n";
message += "Mode de paiement : " + paiement + "\n";

if (mode === "Livraison") {
    message += "Adresse : " + adresse + "\n";
}

if (instructions) {
    message += "Instructions : " + instructions + "\n";
}

message += "\nMA COMMANDE\n";
    message += "Voici ma commande :\n\n";

    panier.forEach(article => {
        const sousTotal = article.prix * article.quantite;
        total += sousTotal;

        message +=
            "- " + article.nom +
            " x " + article.quantite +
            " : " + formaterPrix(sousTotal) + "\n";
    });

    message += "\nMode de réception : " + mode;
    message += "\nTOTAL : " + formaterPrix(total);
    message += "\n\nMerci de confirmer ma commande.";

    const lien =
        "https://wa.me/" + numeroWhatsApp +
        "?text=" + encodeURIComponent(message);

    window.open(lien, "_blank");
});

afficherPanier();

console.log("ELGIE'S WONDERS : panier activé !");
// INTERFACE DE PAIEMENT

const choixPaiement = document.getElementById("mode-paiement");
const montantPaiement = document.getElementById("montant-paiement");
const paiementSelectionne = document.getElementById("paiement-selectionne");
const boutonPaiement = document.getElementById("confirmer-paiement");
const statutPaiement = document.getElementById("statut-paiement");

// Mettre à jour le montant et le mode de paiement
function actualiserPaiement() {
    const total = panier.reduce(
        (somme, article) => somme + article.prix * article.quantite,
        0
    );

    montantPaiement.textContent = formaterPrix(total);

    paiementSelectionne.textContent =
        choixPaiement.value || "Aucun mode sélectionné";
}

choixPaiement.addEventListener("change", actualiserPaiement);

// Bouton de démonstration
boutonPaiement.addEventListener("click", () => {
    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    if (!choixPaiement.value) {
        alert("Veuillez choisir un mode de paiement.");
        return;
    }
const total = panier.reduce(
    (somme, article) => somme + article.prix * article.quantite,
    0
);
   statutPaiement.innerHTML =
    "✅ <strong>Commande prête !</strong><br><br>" +
    "Mode de paiement : " + choixPaiement.value +
    "<br>Montant : " + formaterPrix(total) +
    "<br><br>Simulation réussie : aucun argent débité.";
});

actualiserPaiement();

// SELECTION DES CARTES DE PAIEMENT

const cartesPaiement = document.querySelectorAll(".carte-paiement");

cartesPaiement.forEach(carte => {
    carte.addEventListener("click", () => {

        // Retirer la sélection précédente
        cartesPaiement.forEach(element => {
            element.classList.remove("selectionnee");
        });

        // Sélectionner la carte cliquée
        carte.classList.add("selectionnee");

        // Mettre à jour le mode de paiement
        choixPaiement.value = carte.dataset.paiement;

        // Actualiser l'affichage
        choixPaiement.dispatchEvent(new Event("change"));
    });
});
