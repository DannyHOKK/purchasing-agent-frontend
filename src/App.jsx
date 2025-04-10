import React, { lazy, Suspense } from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navigation from "./layout/Navigation";
import store from "./redux/store";
import PageLoader from "./layout/PageLoader";
import Product from "./pages/Product";
import Customer from "./pages/Customer";
import { Button, ConfigProvider, Layout } from "antd";
import ExchangeRate from "./pages/ExchangeRate";
import Expense from "./pages/Expense";

const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence>
            <Router>
              <Layout style={{ minHeight: "100vh" }}>
                <Navigation />
                <Layout style={{ minHeight: "100vh" }}>
                  <>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/product" element={<Product />} />
                      <Route path="/customer" element={<Customer />} />
                      <Route path="/exchangeRate" element={<ExchangeRate />} />
                      <Route path="/expense" element={<Expense />} />
                    </Routes>
                  </>
                </Layout>
              </Layout>
            </Router>
          </AnimatePresence>
        </Suspense>
      </Provider>
    </>
  );
}

export default App;
