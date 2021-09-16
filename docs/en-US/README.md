# Documentation

_Lees dit in [het Nederlands](../nl-NL/README.md)_

## Table of Contents

* [Local](#local)
    * [Installation](#installation)
    * [Usage](#usage)

## Local

### Installation

```bash
#!/bin/bash
git clone https://github.com/robincunningham2/MagisterCalendar  # Clone the repository
cd MagisterCalendar/  # cd into the repository
npm install && npm run setup  # Setup the repository
```

Setup [a Google OAuth application](Create-an-OAuth-Application.md).

Setup [config variables](Config-Variables.md).

### Usage

To sync all appointments once, use:

```bash
npm start
```

To sync every 15 minutes, run:

```bash
npm run start:repeat
```

_Use `ctrl-c` to exit_
