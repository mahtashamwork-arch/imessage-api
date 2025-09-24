# Medical-Home-Backend
Medical-Home-Backend

## Installation

If you would still prefer to do the installation manually, follow these steps:

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

Run development server:

```bash
npm run dev
```

## Optional: To reset DB on each run
Turn index.js line 7 to True. (This will reset database on each run).

Browse the API and Swagger doc:

[API](http://localhost:3000/api/)

[Swagger Doc](http://localhost:3000/docs/)

## Optional: Database Migration

By default, the application will create the necessary tables when syncing the models. However, if you prefer to use migrations, follow these steps:

### Setting Up Migrations

1. Ensure you have the Sequelize CLI installed:

    ```bash
    npx sequelize-cli
    ```

2. Create a migration:

    ```bash
    npx sequelize-cli migration:generate --name <migration_name>
    ```

##### Ignore step 3 if migration folder is not present
3. Run the migrations:

    ```bash
    npx sequelize-cli db:migrate
    ```

4. Run the following to seed data:

    ```bash
    npx sequelize-cli db:seed:all
    ```