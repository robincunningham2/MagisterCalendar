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
            // User ID used to login to magister
            userId: 'user_id',
            // Magister password matching your userId
            password: 'password'
        },
        // Calendar ID to do the magic on, use the keyword 'primary' for your main calendar
        calendar: 'primary',
        // Your local time zone. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
        timeZone: 'Europe/Amsterdam',
        // Default location name if Magister has none
        defaultLocationName: 'Niet bekend',
        // Default HTML description if the Magister content is empty
        defaultDescription: '<i>Geen inhoud</i>',
        // Google calendar reminders. { useDefault: false } for no reminders at all
        reminders: { useDefault: false }
    },
    scopes: [ // Google OAuth scopes matching your OAuth application:
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.emails.read',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ],
    functions: {
        // Returns a boolean to include or disinclude an appointment based on it's data
        filter: (magisterAppointment: Object) => Boolean,
        // Generate a summary for Google Calendar. Returns a string
        summary: (magisterAppointment: Object) => String,
        // Generate a color for Google Calendar. Returns a number from 1-11
        color: (magisterAppointment: Object) => Number
    }
}
```

### `magisterAppointment` Object

This object passed in `functions.filter`, `functions.summary`,  and `functions.color`.

The `magisterAppointment` is from the Magister API:

```js
magisterAppointment: {
{
    Id: 3647977,
    Links: [
        // Links of previous, current and next appointments
        // Note that these are not always present
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
    // Start of appointment
    Start: 'yyyy-MM-dd"T"HH:mm:ss.0000000Z',
    // End of appointment
    Einde: 'yyyy-MM-dd"T"HH:mm:ss.0000000Z',
    // If it is a lesson, the lesson hour will be here as a number, else null
    LesuurVan: 1,
    // Same as LesuurVan, but the lesson hour the appointment ends
    LesuurTotMet: 2,
    // Boolean indicating if the appoint is the whole day
    DuurtHeleDag: false,
    // Summary
    Omschrijving: 'la - KBR - VX3la_2',
    // Location
    Lokatie: 'D04',
    // Appointment status. Is 4 if the lesson is cancelled. 7 for a normal lesson
    Status: 7,
    // Appointment type. 13 for a normal lesson.
    Type: 13,
    // If the lesson is online
    IsOnlineDeelname: false,
    // Honestly don't know what this is
    WeergaveType: 0,
    // Homework/information, else null
    Inhoud: null,
    // Honestly don't know what this is
    InfoType: 0,
    // If you are late, skipped the class, forgot homework, etc. it will show here
    Aantekening: null,
    // Set homework/information as done
    Afgerond: false,
    // Repeating
    HerhaalStatus: 0,
    Herhaling: null,
    // Subjects
    Vakken: [
        {
            // Unique subject ID
            Id: 79,
            // Subject name
            Naam: 'Latijnse taal en letterkunde'
        }
    ],
    Docenten: [
        {
            // Unique teacher code
            Id: 359,
            // Teacher name
            Naam: 'S.D. Kolenbrander',
            // Teacher code. Usually a 3 letter uppercase code.
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
