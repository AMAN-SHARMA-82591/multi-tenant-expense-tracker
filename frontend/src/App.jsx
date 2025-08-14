import AuthProvider from "./components/common/AuthProvider";
import AppRoutes from "./components/routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
