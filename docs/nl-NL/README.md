# Documentatie

_Read this in [English](../en-US/README.md)_

## Inhoud

* [Lokaal](#lokaal)
    * [Opstelling](#opstelling)
    * [Gebruik](#gebruik)

## Lokaal

### Opstelling

1. Stel het project op met deze commando:

    ```bash
    npm run setup
    ```

2. [Maak een Google OAuth applicatie aan](Maak-een-OAuth-Applicatie.md)

3. Volg [deze gids](Configuratie-Variabelen.md) om het project te configureren.

### Gebruik

Om alle afspraken één keer over te zetten :

```bash
npm start
```

Om alle afspraken elke 15 minuten te synchroniseren:

```bash
npm run start:repeat
```

_Gebruik `ctrl-c` op je toetsenboord om het synchroniseren te stoppen_
