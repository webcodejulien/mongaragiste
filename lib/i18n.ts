export const translations = {
  fr: {
    nav: { search: 'Trouver un garage', login: 'Connexion', register: 'Inscrire mon garage', pro: 'Êtes-vous garagiste ?' },
    hero: { title: 'Votre garagiste, à portée de clic.', sub: 'Trouvez, comparez et réservez votre garagiste en ligne.' },
    search: { placeholder: 'Garage ou ville…', nearMe: '📍 Près de moi', noResult: 'Aucun garage trouvé', open: 'Ouvert', closed: 'Fermé' },
    booking: { title: 'Réserver', steps: ['Service', 'Créneau', 'Vos infos', 'Confirmation'], confirm: 'Confirmer', next: 'Suivant', back: 'Retour' },
    footer: { rights: 'Tous droits réservés' },
  },
  nl: {
    nav: { search: 'Garage vinden', login: 'Inloggen', register: 'Mijn garage registreren', pro: 'Bent u een garagist?' },
    hero: { title: 'Uw garagist, op één klik.', sub: 'Vind, vergelijk en boek uw garagist online.' },
    search: { placeholder: 'Garage of stad…', nearMe: '📍 In mijn buurt', noResult: 'Geen garage gevonden', open: 'Open', closed: 'Gesloten' },
    booking: { title: 'Reserveren', steps: ['Dienst', 'Tijdslot', 'Uw info', 'Bevestiging'], confirm: 'Bevestigen', next: 'Volgende', back: 'Terug' },
    footer: { rights: 'Alle rechten voorbehouden' },
  },
}
export type Lang = keyof typeof translations
export type T = typeof translations['fr']
