# Multi-Tenant Expense Tracker

A full-stack expense tracking application supporting multiple tenants (users/organizations).  
Built with **React (Vite)** for the frontend and **Node.js/Express/MongoDB** for the backend.  
Now includes **Gemini AI integration** for generating monthly expense summaries!

---

## Features

- **User Authentication** (JWT, multi-tenant support)
- **Expense CRUD** (Create, Read, Update, Delete)
- **Expense Reports** (monthly, top category, AI-generated summary)
- **Pagination**
- **Responsive UI** with TailwindCSS
- **Validation** (Zod for backend, form validation on frontend)
- **Protected Routes** (backend middleware)
- **Error Handling** (custom error classes, consistent responses)
- **Gemini AI Integration** (Google Generative Language API)

---

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, Zod
- **Auth:** JWT
- **Validation:** Zod (backend), custom (frontend)
- **AI:** Google Gemini (Generative Language API)
- Node version: 22.17.0

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
GOOGLE_API_KEY=your_gemini_api_key_here
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

## Gemini AI Integration

### How to Get Your Google Gemini API Key

1. **Go to [Google AI Studio](https://aistudio.google.com/)**

   - Sign in with your Google account.

2. **Create a new API key**

   - Click on your profile icon (top right) and select "API Keys".
   - Click "Create API Key".
   - Copy the generated API key.

3. **Enable Generative Language API (if needed)**

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com).
   - Make sure the "Generative Language API" is enabled for your project.

4. **Add the API key to your backend `.env` file**

   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

5. **Restart your backend server after updating `.env`**

**Note:**

- Only API keys from Google AI Studio or Generative Language API will work.
- Do not use keys from other Google APIs (Maps, Firebase, etc.).
- If you set restrictions on your key, ensure your backend matches those restrictions.

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
│   │   │   ├── common/ExpenseTable.jsx
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
- `GET /api/v1/expense/generate-report?month=8` — Get monthly report (with Gemini AI summary)

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
