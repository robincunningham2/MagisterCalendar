## Magister Appointment Object

```js
{
    TaakAangemaaktOp:  String || null,
    TaakGewijzigdOp:  String || null,
    Id: Number, // Afspraak ID
    Links: Array, // Volgende en vorige afspraak-URL's
    Start: String, // Formaat: yyyy-MM-dd'T'HH:mm:ss.SSSZZZZ'Z'
    Einde: String, // Formaat: yyyy-MM-dd'T'HH:mm:ss.SSSZZZZ'Z'
    LesuurVan: Number || null,
    LesuurTotMet: Number || null,
    DuurtHeleDag: Boolean,
    Omschrijving: String,
    Lokatie: String || null,
    Status: Number,
    Type: Number,
    IsOnlineDeelname: Boolean,
    WeergaveType: Number,
    Inhoud: String || null, // Huiswerk/informatie/null
    InfoType: Number,
    Aantekening: String || null, // Aangepaste notities/aantekeningen
    Afgerond: Boolean,
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
            Naam: String, // Bijv. R.P. Astley
            Docentcode: String // 3-letter docentencode
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
