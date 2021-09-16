# Documentatie

_Read this in [English](../en-US/README.md)_

## Inhoud

* [Lokaal](#lokaal)
    * [Installatie](#installatie)
    * [Gebruik](#gebruik)

## Lokaal

### Installatie

```bash
#!/bin/bash
git clone https://github.com/robincunningham2/MagisterCalendar  # Clone the repository
cd MagisterCalendar/  # cd into the repository
npm install && npm run setup  # Setup the repository
```

Maak [een Google OAuth applicatie aan](Maak-een-OAuth-Applicatie.md).

[Zet de configuratie op](Configuratie-Variabelen.md).

### Gebruik

Om alle afspraken één keer over te zetten:

```bash
npm start
```

Om alle afspraken elke 15 minuten te synchroniseren:

```bash
npm run start:repeat
```

_Gebruik `ctrl-c` op je toetsenboord om het synchroniseren te stoppen_
