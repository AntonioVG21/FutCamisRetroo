# Firebase Configuration for TiendaOficial

This document provides instructions for setting up Firebase in the TiendaOficial project.

## Firebase Setup

### 1. Create a Firebase Project


1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the steps to create a new project

### 2. Set Up Firestore Database

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Select the server location closest to your users
5. Click "Enable"

### 3. Register Your Web App

1. In the Firebase console, click on the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "TiendaOficial Web")
3. Register the app
4. Copy the Firebase configuration object (it has been already added to the project)

### 4. Update the .env File

1. Open the `.env` file in the project root
2. Update the Firebase project ID with your project ID:

```
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

That's it! The application is now configured to work with your Firebase project. All other Firebase configuration values are already set in the `src/lib/firebase.ts` file.

## Database Structure

The project uses the following collections in Firestore:

### Collection: `orders`

Stores orders placed by customers.

Fields:
- `customer`: Object with customer data
  - `name`: Full name
  - `email`: Email
  - `phone`: Phone
  - `address`: Address
  - `city`: City
  - `postalCode`: Postal code
  - `leagues`: League preferences
- `items`: Array of products in the order
  - `id`: Product ID
  - `name`: Product name
  - `price`: Unit price
  - `quantity`: Quantity
  - `specifications`: Specifications (for packs)
  - `notes`: Additional notes (for packs)
  - `isPack`: Indicates if it's a pack
- `total`: Total order amount
- `paymentMethod`: Payment method used
- `status`: Order status (pending, completed, etc.)
- `createdAt`: Creation date and time

## Security Rules

Security rules for Firestore are already configured in the `firestore.rules` file. For development, you can use the default rules that allow all operations:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, you should configure stricter rules according to your security needs.

## Next Steps

1. Implement user authentication with Firebase Auth
2. Configure stricter security rules for production
3. Implement Firebase Storage for image management
4. Set up Firebase Hosting for deployment