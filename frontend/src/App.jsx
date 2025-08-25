import AuthProvider from "./context/AuthProvider";
import AppRoutes from "./components/routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
