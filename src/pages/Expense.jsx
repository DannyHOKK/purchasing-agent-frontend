import React from "react";
import { motion } from "framer-motion";
import PageLayout from "../layout/PageLayout";
import ExpenseCrud from "../modules/ExpenseCrudModule";

const Expense = () => {
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
        <ExpenseCrud />
      </PageLayout>
    </motion.div>
  );
};

export default Expense;
