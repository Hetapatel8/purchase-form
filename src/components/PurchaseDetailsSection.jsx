import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {clientData, currencies, orderType } from "../utils/formData";
import "react-datepicker/dist/react-datepicker.css";
import CustomClearIndicator from "./CustomClearIndicator";
import CustomDropdownIndicator from "./CustomDropdownIndicator";

const PurchaseDetailsSection = ({
    formData,
    selectedOption,
    dates,
    handleInputChange,
    handleSelectChange,
    isFormSaved,
    setDates
}) => {
    const clientNames = clientData.map((client) => ({
        value: client.id,
        label: client.clientName.label,
      }));
    return (
        <div className="purchase_details_section">
        <div className="row">
          <div className="col-xl col-md-6 mb-xl-0 mb-md-3 mt-2">
            <label htmlFor="clientName" className="mb-1 fw-medium">
              Client Name{" "}
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <Select
              components={{
                DropdownIndicator: CustomDropdownIndicator,
                ClearIndicator: CustomClearIndicator,
              }}
              value={selectedOption.clientNames}
              onChange={(value) => handleSelectChange("clientNames", value)}
              options={clientNames}
              id="clientName"
              name="clientName"
              required
              isDisabled={isFormSaved}
              isClearable
            />
          </div>
          <div className="col-xl col-md-6 mb-xl-0 mb-md-3 mt-2">
            <label htmlFor="orderType" className="mb-1 fw-medium">
              Purchase Order Type
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <Select
              components={{
                DropdownIndicator: CustomDropdownIndicator,
                ClearIndicator: CustomClearIndicator,
              }}
              value={formData.orderType}
              onChange={(value) => handleInputChange("orderType", value)}
              options={orderType}
              id="orderType"
              name="orderType"
              required
              isDisabled={isFormSaved}
              isClearable
            />
          </div>
          <div className="col-md col-12 mb-md-0 mt-2">
            <label htmlFor="orderNumber" className="mb-1 fw-medium">
              Purchase Order No.
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              className="d-block col-12 "
              placeholder="PO Number"
              type="text"
              id="orderNumber"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={(e) => handleInputChange("orderNumber", e.target.value)}
              required
              disabled={isFormSaved}
            />
          </div>
          <div className="col-md col-12 mb-md-0 mt-2">
            <label htmlFor="ReceivedOn" className="mb-1 d-block fw-medium">
              Received On
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <DatePicker
              selected={dates.receivedDate}
              onChange={(date) =>
                setDates((prev) => ({ ...prev, receivedDate: date }))
              }
              id="ReceivedOn"
              required
              placeholderText="Received On"
              disabled={isFormSaved}
            />
          </div>
        </div>
        <div className="row mt-xxl-4 mt-md-3 mt-2 align-items-end ">
          <div className="col-xxl col-md-6 mb-xxl-0 mb-3">
            <div>
              <label htmlFor="ReceiverName" className="mb-1 fw-medium">
                Received From
                <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                  *
                </span>
              </label>
              <input
                className="d-block col-12 "
                placeholder="Received From Name"
                type="text"
                id="ReceiverName"
                name="ReceiverName"
                value={formData.receiverName}
                onChange={(e) =>
                  handleInputChange("receiverName", e.target.value)
                }
                required
                disabled={isFormSaved}
              />
            </div>
          </div>
          <div className="col-xxl col-md-6 mb-xxl-0 mb-md-3 mb-2">
            <input
              className="d-block col-12 "
              placeholder="Received From Email ID"
              type="email"
              id="ReceiverEmail"
              name="ReceiverEmail"
              value={formData.receiverEmail}
              onChange={(e) =>
                handleInputChange("receiverEmail", e.target.value)
              }
              required
              disabled={isFormSaved}
            />
          </div>
          <div className="col-md col-12 mb-md-0 mb-2">
            <label htmlFor="startDate" className="mb-1 d-block fw-medium">
              PO Start Date
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <DatePicker
              selected={dates.startDate}
              onChange={(date) => {
                setDates((prev) => {
                  const isEndDateInvalid = prev.endDate && date > prev.endDate;
                  return {
                    ...prev,
                    startDate: date,
                    endDate: isEndDateInvalid ? null : prev.endDate,
                  };
                });
              }}
              id="startDate"
              required
              placeholderText="Start Date"
              disabled={isFormSaved}
            />
          </div>
          <div className="col-md col-12 mb-md-0 mb-2">
            <label htmlFor="endDate" className="mb-1 d-block fw-medium">
              PO End Date
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <DatePicker
              selected={dates.endDate}
              onChange={(date) =>
                setDates((prev) => ({ ...prev, endDate: date }))
              }
              id="endDate"
              minDate={dates.startDate}
              placeholderText="End Date"
              required
              disabled={isFormSaved}
            />
          </div>
          <div className="col-md col-12 mb-md-0 mb-2">
            <label htmlFor="budget" className="mb-1 fw-medium ">
              Budget
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <input
              className="d-block col-12 "
              placeholder="Budget"
              maxLength={5}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
              }
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              type="text"
              id="budget"
              name="budget"
              required
              disabled={isFormSaved}
            />
          </div>
          <div className="col-md col-12">
            <label className="mb-1 fw-medium">
              Currency
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <Select
              components={{
                DropdownIndicator: CustomDropdownIndicator,
                ClearIndicator: CustomClearIndicator,
              }}
              value={selectedOption.currencies}
              onChange={(value) => handleSelectChange("currencies", value)}
              options={currencies}
              required
              isDisabled={isFormSaved}
              isClearable
            />
          </div>
        </div>
        </div>
    )
}
export default PurchaseDetailsSection