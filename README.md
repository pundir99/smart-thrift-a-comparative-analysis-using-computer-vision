# Tomato E-Commerce

**Tomato E-Commerce** is a web-based platform designed for selling food and other items to users. It provides a seamless user experience with features like order cancellation, secure payments, and a user-friendly interface.

---

## Features

- **Admin Panel**: Manage products, orders, and user data efficiently.
- **Backend**: Handles all the server-side operations, database management, and APIs.
- **Frontend**: Provides an intuitive and responsive user interface for customers.
- **Secure Payments**: Integration with Stripe for safe and secure payment processing.
- **Order Management**: Users can cancel orders anytime before delivery.

---

## Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Gateway**: Stripe API
- **Hosting**: Vercel/Heroku for deployment

---

## Installation and Setup

To run this project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/mayank-2004/E-commerce-Tomato.git
cd E-commerce-Tomato
```

### 2. Install Dependencies
```bash
Navigate to the respective directories (admin, backend, and frontend) and install dependencies:

bash
Copy code
cd admin
npm install
cd ../backend
npm install
cd ../frontend
npm install
```

### 3. Start the Development Servers
```bash
Run the servers for admin, backend, and frontend:

bash
Copy code
# For backend
cd backend
npm run dev

# For frontend
cd frontend
npm run dev

# For admin panel
cd admin
npm run dev
```

### 4. Access the Application
```bash
Frontend: Open http://localhost:5174 in your browser.
Admin Panel: Open http://localhost:5173.
Backend API: Accessible on http://localhost:4000.
```

### Project Structure
```bash
E-commerce-Tomato/
├── admin/          # Admin panel code
├── backend/        # Backend server code
├── frontend/       # Frontend code
├── README.md       # Project documentation
```