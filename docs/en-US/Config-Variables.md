## Config Variables

Create a file at `config/config.js`:

_Note that if you are running this program on a hosting serivice (like Heroku) where you can onnly set config
variables, you can set the `MAGISTER_CALENDAR_CONFIG` variable to a string of this file._

```js
module.exports = {
    settings: {
        magister: {
            // Your Magister school ID. Found in the domain name of Magister. e.g.
            // abc.magister.net -> 'abc'
            schoolId: 'school_id',
            // Gebruikers ID om in te loggen met magister
            userId: 'user_id',
            // Magister wachtwoord die overeenkomt met de gebruikersnaam.
            password: 'password'
        },
        // Calendar ID om de magie op te doen, Gebruil 'primary' voor de standaard agenda.
        calendar: 'primary',
        // Jouw lokale tijdzone. Bekijk https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
        timeZone: 'Europe/Amsterdam',
        // Standaard lokatie naam als Magister geen lokatie heeft
        defaultLocationName: 'Niet bekend',
        // HTML beschrijving als Magister er geen heeft
        defaultDescription: '<i>Geen inhoud</i>',
        // Google Agenda herinneringen. { useDefault: false } for geen herinneringen
        reminders: { useDefault: false }
    },
    scopes: [ // Google OAuth-bereiken die overeenkomen met jouw OAuth applicatie:
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.emails.read',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ],
    functions: {
        // Retourneert een boolean om een afspraak op te nemen of uit te sluiten op basis van de Magister gegevens
        filter: (magisterAppointment: Object) => Boolean,
        // Genereer een samenvatting voor Google Agenda. Retourneert een string
        summary: (magisterAppointment: Object) => String,
        // Genereer een kleur voor Google Agenda. Retourneert een getal van 1-11
        color: (magisterAppointment: Object) => Number
    }
}
```

### `magisterAppointment` Object

Dit object is gebruikt in `functions.filter`, `functions.summary` en `functions.color`.

De `magisterAppointment` is van de Magister API:

```js
magisterAppointment: {
{
    Id: 3647977,
    Links: [
        // Links van de vorige, huidige en volgende afspraken
        {
            Rel: 'Prev',
            Href: '/api/personen/123456/afspraken/3647976'
        },
        {
            Rel: 'Self',
            Href: '/api/personen/123456/afspraken/3647977'
        },
        {
            Rel: 'Next',
            Href: '/api/personen/123456/afspraken/3647978'
        }
    ],
    // Begin van een afspraak
    Start: 'yyyy-MM-dd"T"HH:mm:ss.0000000Z',
    // Einde van een afspraak
    Einde: 'yyyy-MM-dd"T"HH:mm:ss.0000000Z',
    // Als het een les is, staat het lesuur hier als een getal, anders null
    LesuurVan: 1,
    // Zelfde als LesuurVan, maar op het lesuur eindigt de afspraak
    LesuurTotMet: 2,
    // Booleaanse waarde die aangeeft of de afspraak de hele dag is
    DuurtHeleDag: false,
    // Omschrijving
    Omschrijving: 'la - KBR - VX3la_2',
    // Lokatie
    Lokatie: 'D04',
    // Afspraakstatus. Is 4 als de les niet doorgaat. 7 voor een normale les
    Status: 7,
    // Afspraak type. 13 voor een normale les.
    Type: 13,
    // Of de les online is
    IsOnlineDeelname: false,
    // Weet eerlijk gezegd niet wat dit is
    WeergaveType: 0,
    // Huiswerk/informatie, anders null
    Inhoud: null,
    // Weet eerlijk gezegd niet wat dit is
    InfoType: 0,
    // Als je te laat bent, gespijbeld hebt, huiswerk bent vergeten, enz., wordt dit hier weergegeven
    Aantekening: null,
    // Stel huiswerk/informatie in als klaar
    Afgerond: false,
    // Herhalen
    HerhaalStatus: 0,
    Herhaling: null,
    // Vakken
    Vakken: [
        {
            // Uniek vak ID
            Id: 79,
            // Vak name
            Naam: 'Latijnse taal en letterkunde'
        }
    ],
    Docenten: [
        {
            // Unieke docenten code
            Id: 359,
            // Docenten name
            Naam: 'S.D. Kolenbrander',
            // Docente code. Usually a 3 letter uppercase code.
            Docentcode: 'KBR'
        },
        ...
    ],
    Lokalen: [
        {
            // Classroom name
            Naam: 'D04'
        }
    ],
    // Groups
    Groepen: null,
    // If the appointment/lesson is linked to an assignment the ID will be here, else 0
    OpdrachtId: 0,
    // If the appointment/lesson has any attatchments
    HeeftBijlagen: false,
    // Attatchments
    Bijlagen: null
}
```

---

You are now done 🎉 &nbsp; — &nbsp;[Back to readme](README.md)
