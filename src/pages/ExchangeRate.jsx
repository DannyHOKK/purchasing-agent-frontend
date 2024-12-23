import React from "react";
import { motion } from "framer-motion";
import PageLayout from "../layout/PageLayout";
import ExchangeRateCrud from "../modules/ExchangeRateCrudModule";
import ExchangeTable from "../modules/ExchangeRateCrudModule/ExchangeTable";

const ExchangeRate = () => {
  const config = {
    type: "spring",
    damping: 20,
    stiffness: 100,
  };

  return (
    <motion.div
      transition={config}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
    >
      <PageLayout>
        <div
          className="whiteBox shadow"
          style={{ color: "#595959", fontSize: 13 }}
        >
          <ExchangeRateCrud />
        </div>

        <div className="space30"></div>

        <div
          className="whiteBox shadow"
          style={{ color: "#595959", fontSize: 13 }}
        >
          <ExchangeTable />
        </div>
      </PageLayout>
    </motion.div>
  );
};

export default ExchangeRate;
