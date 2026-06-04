import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Remessas from "./pages/Remessas";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import Titlebar from "./components/Titlebar/Titlebar";
import "./components/Titlebar/Titlebar.css";

export default function App({ toggleTheme, mode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Titlebar mode={mode} />
      <BrowserRouter>
        <Layout toggleTheme={toggleTheme} mode={mode}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/lancamentos" element={<Expenses />} />
            <Route path="/remessas" element={<Remessas />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}