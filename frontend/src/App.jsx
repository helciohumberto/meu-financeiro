import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/lancamentos" element={<Expenses />} />
            <Route path="/settings" element={<Settings />} /> {/* <-- E AQUI */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}