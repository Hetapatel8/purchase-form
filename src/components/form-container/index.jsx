import React from "react";
import PurchaseForm from "../form";

const FormContainer = () => {
  return (
    <div className="container-fluid mt-4 px-4">
      <h3 className="fs-5 fw-bold text-black">Purchase Order | New</h3>
      <div className="rounded-3 bg-white shadow py-4 mt-3">
        <PurchaseForm />
      </div>
    </div>
  );
};

export default FormContainer;
