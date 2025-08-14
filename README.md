### Node version: 22.17.0

# Multi-Tenant Expense Tracker

A full-stack expense tracking application supporting multiple tenants (users/organizations).  
Built with **React (Vite)** for the frontend and **Node.js/Express/MongoDB** for the backend.

---

## Features

- **User Authentication** (JWT, multi-tenant support)
- **Expense CRUD** (Create, Read, Update, Delete)
- **Expense Reports** (monthly, top category)
- **Pagination**
- **Responsive UI** with TailwindCSS
- **Validation** (Zod for backend, form validation on frontend)
- **Protected Routes** (backend middleware)
- **Error Handling** (custom error classes, consistent responses)

---

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, Zod
- **Auth:** JWT
- **Validation:** Zod (backend), custom (frontend)

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/multi-tenant-expense-tracker.git
cd multi-tenant-expense-tracker
```

---

### 2. Backend Setup

#### a. Install dependencies

```sh
cd backend
npm install
```

#### b. Environment Variables

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

#### c. Start the backend server

```sh
npm run dev
```

or

```sh
node index.js
```

---

### 3. Frontend Setup

#### a. Install dependencies

```sh
cd frontend
npm install
```

#### b. Environment Variables

Create a `.env` file in the `frontend` folder:

```
VITE_APP_BACKEND_URL=http://localhost:5000/api/v1
```

#### c. Start the frontend

```sh
npm run dev
```

---

## Folder Structure

```
multi-tenant-expense-tracker/
├── backend/
│   ├── routes/
│   ├── model/
│   ├── validators/
│   ├── utils/
│   ├── config/
│   ├── index.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── expenses/ExpenseTable.jsx
│   │   │   ├── common/ReportDropdown.jsx
│   │   │   ├── common/NewExpenseDialog.jsx
│   │   │   ├── common/GenerateReport.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   └── ...
│   ├── index.css
│   └── ...
```

---

## API Endpoints

### Auth

- `POST /api/v1/auth/sign-up` — Register new user
- `POST /api/v1/auth/sign-in` — Login

### Expense

- `GET /api/v1/expense?page=1&limit=10` — Get paginated expenses
- `POST /api/v1/expense` — Create new expense
- `GET /api/v1/expense/generate-report?month=8` — Get monthly report

---

## Customization

- **Add new fields** to expenses in `ExpenseModel` and update forms.
- **Change report logic** in `/generate-report` route.
- **Style** components with TailwindCSS classes.

---

## Credits

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
