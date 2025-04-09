import LogIn from "./pages/auth/LogIn";
import Signup from "./pages/auth/Signup";
import Home from "./pages/home/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Iniciate from "./pages/auth/Iniciate";
import Header from "./components/header&footer/Header";
import { UserProvider, UseUser } from "./contexts/UserContext";
import NavigationFooter from "./components/header&footer/Footer";
import Settings from "./pages/others/Settings";
import AddVoyage from "./pages/others/AddVoyage";
import Profile from "./pages/others/Profile";
import Notifications from "./pages/others/Notifications";
import Stats from "./pages/others/Stats";
import VoyageDetail from "./pages/others/VoyageDetail";
import { VoyageProvider } from "./contexts/VoyageContext";
import { BoatProvider } from "./contexts/BoatContext";
import AddNewBoat from "./pages/others/AddNewBoat";
import EditVoyage from "./pages/others/EditVoyage";
import Loading from "./utils/loader/loading";

function LayOut() {
  return (
    <>
      <Header />
      <Outlet />
      <NavigationFooter />
    </>
  );
}
function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <UserProvider>
        <AppWithUser />
      </UserProvider>
    </BrowserRouter>
  );
}

function PublicRoute({ children }) {
  const { isAuth, loading } = UseUser();
  if (loading) {
    return <Loading />;
  }
  if (isAuth === true) {
    return <Navigate to="/home" />;
  }
  return children;
}
function ProtectedRoute({ children }) {
  const { isAuth, loading } = UseUser();
  if (loading) {
    return <Loading />;
  }
  if (isAuth === false) {
    return <Navigate to="/" />;
  }
  return children;
}

// Componente intermedio que tiene acceso al UserProvider
function AppWithUser() {
  const { user } = UseUser();

  return (
    <VoyageProvider user={user}>
      <BoatProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Iniciate />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LogIn />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route element={<LayOut />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addvoyage"
              element={
                <ProtectedRoute>
                  <AddVoyage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editvoyage/:id"
              element={
                <ProtectedRoute>
                  <EditVoyage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addboat"
              element={
                <ProtectedRoute>
                  <AddNewBoat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/voyage/:id"
              element={
                <ProtectedRoute>
                  <VoyageDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={<h1>No llegamos a eso, 404 por ahora</h1>}
            />
          </Route>
        </Routes>
      </BoatProvider>
    </VoyageProvider>
  );
}
export default App;
