# Generic DataGrid Fullstack App

A **Generic DataGrid** fullstack application featuring a reusable **DataGrid** component built with **AG Grid** (React), integrated with a backend built using **Express.js** and **MongoDB**.

## Getting Started

This section guides you through setting up both the backend and frontend for the application.

## Backend Setup

Before starting the application, make sure to set up the backend environment variables.

#### 1. Create `nodemon.json` inside the `serve/` directory

Create a file named `nodemon.json` in the `serve/` directory and add the following configuration:

```json
{
  "env": {
    "MONGO_USER": "yourusername",
    "MONGO_PASSWORD": "yourpassword",
    "MONGO_DB": "yourdbname"
  }
}
```
Be sure to replace yourusername, yourpassword, and yourdbname with your actual MongoDB credentials.
#### 2. your own CSV File Loading

Once the backend is up and running:

- The application will **automatically load** a sample CSV file from the `data/` folder. So if yu don't wanna use the default one,

You can:

- **Replace** the existing `.csv` file in the `data/` folder with your own file (same structure).
- **Delete** the sample file and **upload** a new CSV manually through the frontend UI after launching the app.

## Install Dependencies and Start the Application

In the **project root directory**, run the following commands to install the necessary dependencies and start the application:

```bash
yarn install
yarn start

```
