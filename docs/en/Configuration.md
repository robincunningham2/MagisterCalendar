## Configuration

* [Create a Google OAuth application](.) and save the credentials to `config/credentials.json`
- Create a file at `config/config.js`:

```js
module.exports = {
    googleApis: {
        calendarId: String,
        timeZone: String,
        scopes: Array[String]
    },
    appointments: {
        defaults: {
            location: String,
            description: String,
        },
        reminders: Object,
        filter: Function,
        summary: Function,
        color: Function
    },
    magister: {
        schoolId: String,
        userId: String || Number,
        password: String
    }
};
```

#### googleApis.calendarId `String`

The calendar ID to store all the appointments. `primary` for the main calendar.

#### googleApis.timeZone `String`

A timezone from the TZ database. See [List of tz database time zones - Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for more info. Use `Europe/Amsterdam` for Amsterdam.

#### googleApis.scopes `Array[String]`

Google OAuth scopes. For this use:

```js
[
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
]
```

**NOTE:** If you don't provide the right scopes, the program will not complete successfully

#### appointments.defaults.location `String`

Default location if none is provided by Magister.

#### appointments.defaults.description `String`

If no description is provided, this is the default description. HTML is supported.

#### appointments.reminders `Object`

Google calendar reminders.

For the default reminders:

```js
reminders: { useDefault: true }
```

For no reminders (recommended):

```js
reminders: { useDefault: false }
```

#### appointments.filter `Function`

```js
filter(magisterAppointment: Object): Boolean
```

Example:

```js
// Only include appointmen\ if they don't contain `foo` in the summary.
filter: function($) {
    return $.Omschrijving.indexOf('foo') != -1;
}
```

[Magister object](#magister-object)

#### appointments.summary `Function`

Generate a summary based on the Magister appointment.

```js
summary(magisterAppointment: Object): String
```

Example:

```js
// Return the lesson hour and the subject name, but only if it is a
// lesson. Else, return the Magister summary.
summary: function($) {
    if ($.Vakken.length) return `${$.LesuurVan}. ${$.Vakken[0]}`;
    else return $.Omschrijving;
}
```

[Magister object](#magister-object)

#### appointments.color `Function`

Generate a Google Calendar color based on the Magister appointment.

Must be a `Number` between 1-11.

```js
summary(magisterAppointment: Object): Number
```

Example:

```js
// If the appointment is a lesson, make it blue, otherwise make it grey
summary: function($) {
    if ($.Vakken.length) return 7; // ColorID for blue
    else return 8; // ColorID for grey
}
```

[Magister object](#magister-object)

#### magister.schoolId `String`

Your school ID. Can be found in the domain name of Magister:

```py
https://llr.magister.net
        ^^^ --> 'llr'
```

#### magister.userId `String`

Your login username/user id.

#### magister.password `String`

Your password matching your user ID.

### Magister Object

```json
{

}
```
