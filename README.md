# OPSE API

The offical API for OPSE database.

## Endpoints

* `/teams` - This will return all the **__teams__** in the database
* `/teams/:id` - This will return **__teams__** with the same id in the database
* `/teams/:abbrev` - This will return **__teams__** with the same abbrevation in the database

<br>

* `/schools` - This will return all the **__schools__** in the database
* `/schools/:id` - This will return **__schools__** with the same id in the database
* `/schools/:abbrev` - This will return **__schools__** with the same abbrevation in the database

<br>

* `/leagues` - This will return all the **__leagues__** in the database
* `/leagues/:id` - This will return **__league__** with the same id in the database

<br>

* `/players` - This will return all the **__players__** in the database
* `/players/:id` - This will return all the **__player__** with the same id in the database

<br>

## For Developers

Here is a list of requires env variables

```
PORT - The PORT You want to run your localhost on

DB_PORT - The PORT of the Database
DB_HOST - The HOST of the Database
DB_NAME - The NAME of the Database
DB_USER - The USER of the Database
DB_PASS - The PASSWORD of the Database
```
