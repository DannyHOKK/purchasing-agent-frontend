import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExchangeForm from "./ExchangeForm";
import { getExchangeRate } from "../../redux/exchangeRate/exchangeRateAction";

const ExchangeRateCrud = () => {
  const { exchangeRateLoading, exchangeRateData } = useSelector(
    (state) => state.exchangeRate
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExchangeRate());
  }, []);

  return (
    <div className="p-4 container-sm">
      <ExchangeForm />
    </div>
  );
};

export default ExchangeRateCrud;
