## Magister Appointment Object

```js
{
    TaakAangemaaktOp:  String || null,
    TaakGewijzigdOp:  String || null,
    Id: Number, // Appointment ID
    Links: Array, // Next and previous appointment URLs
    Start: String, // Format: yyyy-MM-dd'T'HH:mm:ss.SSSZZZZ'Z'
    Einde: String, // Format: yyyy-MM-dd'T'HH:mm:ss.SSSZZZZ'Z'
    LesuurVan: Number || null,
    LesuurTotMet: Number || null,
    DuurtHeleDag: Boolean,
    Omschrijving: String,
    Lokatie: String || null,
    Status: Number,
    Type: Number,
    IsOnlineDeelname: Boolean,
    WeergaveType: Number,
    Inhoud: String || null, // Homework/information/null
    InfoType: Number,
    Aantekening: String || null, // Custom notes
    Afgerond: Boolean, // Completed
    HerhaalStatus: Number,
    Herhaling: String || null,
    Vakken: [
        {
            Id: Number,
            Naam: String
        },
        ...
    ],
    Docenten: [
        {
            Id: Number,
            Naam: String, // E.g. R.P. Astley
            Docentcode: String // E.g. AAA
        },
        ...
    ],
    Lokalen: [
        { Naam: String },
        ...
    ],
    Groepen: String || null,
    OpdrachtId: Number,
    HeeftBijlagen: Boolean,
    Bijlagen: Array
}
```
