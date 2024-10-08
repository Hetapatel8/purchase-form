import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { clientData, currencies, orderType } from "../../utils/formData";
import "react-datepicker/dist/react-datepicker.css";

const PurchaseForm = () => {
  const initialTalentDetail = {
    jobTitle: "",
    jobId: "",
    talents: [],
    currency: "",
    contractDuration: "",
    billRate: "",
    standardTime: "",
    overTime: "",
  };

  const [formData, setFormData] = useState({
    orderNumber: "",
    receiverName: "",
    receiverEmail: "",
    budget: "",
    orderType: "",
  });

  const [selectedOption, setSelectedOption] = useState({
    clientNames: null,
    currencies: null,
  });

  const [dates, setDates] = useState({
    receivedDate: null,
    startDate: null,
    endDate: null,
  });

  const [jobOptions, setJobOptions] = useState([]);
  const [talentDetails, setTalentDetails] = useState([initialTalentDetail]);

  const clientNames = clientData.map((client) => ({
    value: client.id,
    label: client.clientName.label,
  }));

  const handleSelectChange = (name, value, index) => {
    setSelectedOption((prev) => ({ ...prev, [name]: value }));

    if (name === "clientNames" && value) {
      const selectedClient = clientData.find(
        (client) => client.id === value.value
      );
      const jobs =
        selectedClient?.jobData.map((job) => ({
          value: job.jobId,
          label: job.label,
          talents: job.talentData, // Assuming talents are in jobData
        })) || [];
      setJobOptions(jobs);
      setTalentDetails([initialTalentDetail]);
    }

    if (name === "jobTitle" && value) {
      const selectedJob = jobOptions.find(
        (option) => option.label === value.label
      );
      setTalentDetails((prevDetails) => {
        const newDetails = [...prevDetails];
        if (index < newDetails.length) {
          newDetails[index] = {
            ...newDetails[index],
            jobId: selectedJob ? selectedJob.value : "",
            talents: selectedJob ? selectedJob.talents : [], // Set talents here
          };
        }
        return newDetails;
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTalentChange = (name, value, index, tmpIndex) => {
    setTalentDetails((prevDetails) => {
      const newDetails = [...prevDetails]; // Create a copy of the current talent details
      const talent = { ...newDetails[index] }; // Get the specific talent detail

      if (tmpIndex < talent.talents.length) {
        // Create a new object to update
        talent[name] = value; // Update the specific field

        newDetails[index] = talent; // Replace the old talent with the updated one
      }

      return newDetails; // Return the updated details
    });
  };

  const addAnotherTalentSection = () => {
    setTalentDetails([...talentDetails, initialTalentDetail]);
  };

  const handleReset = () => {
    setFormData({
      orderNumber: "",
      receiverName: "",
      receiverEmail: "",
      budget: "",
      orderType: "",
    });
    setSelectedOption({ clientNames: null, currencies: null });
    setDates({ receivedDate: null, startDate: null, endDate: null });
    setTalentDetails([initialTalentDetail]);
    setJobOptions([]);
  };

  const handleSave = () => {
    console.log("Form Data:", {
      formData,
      selectedOption,
      dates,
      talentDetails,
    });
  };

  return (
    <form className="purchase_order_form px-4">
      <div className="purchase_details_section">
        <div className="row">
          <div className="col">
            <label htmlFor="clientName" className="mb-1 fw-medium">
              Client Name{" "}
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <Select
              value={selectedOption.clientNames}
              onChange={(value) => handleSelectChange("clientNames", value)}
              options={clientNames}
              id="clientName"
              name="clientName"
              required
            />
          </div>
          <div className="col">
            <label htmlFor="orderType" className="mb-1 fw-medium">
              Purchase Order Type
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <Select
              value={formData.orderType}
              onChange={(value) => handleInputChange("orderType", value)}
              options={orderType}
              id="orderType"
              name="orderType"
            />
          </div>
          <div className="col">
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
            />
          </div>
          <div className="col">
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
              placeholderText="Received On"
            />
          </div>
        </div>
        <div className="row mt-4 align-items-end">
          <div className="col">
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
              />
            </div>
          </div>
          <div className="col">
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
            />
          </div>
          <div className="col">
            <label htmlFor="startDate" className="mb-1 d-block fw-medium">
              PO Start Date
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <DatePicker
              selected={dates.startDate}
              onChange={(date) =>
                setDates((prev) => ({ ...prev, startDate: date }))
              }
              placeholderText="Start Date"
            />
          </div>
          <div className="col">
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
              minDate={dates.startDate}
              placeholderText="End Date"
            />
          </div>
          <div className="col">
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
            />
          </div>
          <div className="col">
            <label htmlFor="budget" className="mb-1 fw-medium">
              Currency
              <span className="fs-6 fw-bold ms-1" style={{ color: "red" }}>
                *
              </span>
            </label>
            <Select
              value={selectedOption.currencies}
              onChange={(value) => handleSelectChange("currencies", value)}
              options={currencies}
            />
          </div>
        </div>
        <div className=" mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fs-5 lh-base fw-medium mb-0 text-black py-1">
              Talent Detail
            </h5>
            {formData.orderType?.value === "Group PO" && (
              <div
                className="pt-1 pb-2 px-3 d-flex justify-content-between align-items-center border border-dark fs-6 fw-medium rounded-pill lh-base"
                style={{ cursor: "pointer" }}
                onClick={addAnotherTalentSection}
              >
                + Add Another
              </div>
            )}
          </div>
          {talentDetails.map((talent, index) => (
            <div className="talent_detail_section mb-5" key={index}>
              <div className="row mt-4">
                <div className="col-6 flex-row d-flex mb-3">
                  <div className="col-6" style={{ paddingRight: 12 }}>
                    <label htmlFor="jobTitle" className="mb-1 fw-medium">
                      JOB Title/REQ Name{" "}
                      <span
                        className="fs-6 fw-bold ms-1"
                        style={{ color: "red" }}
                      >
                        *
                      </span>
                    </label>
                    <Select
                      defaultValue={talent.jobTitle}
                      onChange={(value) =>
                        handleSelectChange("jobTitle", value, index)
                      }
                      options={jobOptions}
                      id="jobTitle"
                      name="jobTitle"
                      required
                    />
                  </div>
                  <div className="col-6" style={{ paddingLeft: 12 }}>
                    <label htmlFor="jobId" className="mb-1 fw-medium">
                      JOB ID/REQ ID{" "}
                      <span
                        className="fs-6 fw-bold ms-1"
                        style={{ color: "red" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      className="d-block col-12 "
                      placeholder="JOB ID/REQ ID"
                      type="text"
                      id="jobId"
                      name="jobId"
                      value={talent.jobId}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div
                className=""
                style={{
                  background: "rgb(204, 204, 204)",
                  height: 1,
                  marginInline: "-24px",
                }}
              ></div>
              {talent.talents.map((tmp_talent, tmp_index) => (
                <div className="row mt-3" key={`${index}-${tmp_index}`}>
                  <label className="d-flex align-items-center position-relative talentCheckbox">
                    <input
                      className="position-absolute opacity-0 border-0 checkbox_input"
                      type="checkbox"
                      value=""
                      id={`talentCheckbox_${index}`}
                      style={{
                        width: 18,
                        height: 18,
                        cursor: "pointer",
                      }}
                    />
                    <span
                      className="d-inline-flex align-items-center justify-content-center align-top rounded-1 gx-3 checkbox_control"
                      aria-hidden="true"
                      id=""
                      style={{
                        width: 18,
                        height: 18,
                        userSelect: "none",
                      }}
                    ></span>
                    <span className="fw-medium fs-6 ms-2 text-black">
                      {tmp_talent}
                    </span>
                  </label>
                  <div className="row mt-3 px-0 mx-0">
                    <div className="col-6 flex-row d-flex pe-0">
                      <div
                        className="col-6 position-relative"
                        style={{ paddingRight: 12 }}
                      >
                        <label htmlFor="orderNumber" className="mb-1 fw-medium">
                          Contract Duration
                        </label>
                        <input
                          className="d-block col-12 "
                          placeholder="Contract Duration"
                          type="text"
                          id={`contractDuration_${index}_${tmp_index}`}
                          name="contractDuration"
                          value={talent.contractDuration || ""}
                          onChange={(e) =>
                            handleTalentChange(
                              "contractDuration",
                              e.target.value,
                              index,
                              tmp_index
                            )
                          }
                          onInput={(e) =>
                            (e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ))
                          }
                        />
                        <span className="placeholder-right-text fw-medium position-absolute">
                          Months
                        </span>
                      </div>
                      <div
                        className="col-3 position-relative"
                        style={{ paddingRight: 12 }}
                      >
                        <label htmlFor="orderNumber" className="mb-1 fw-medium">
                          Bill Rate
                        </label>
                        <input
                          className="d-block col-12 "
                          placeholder="Bill Rate"
                          type="text"
                          id={`billRate_${index}_${tmp_index}`}
                          name="billRate"
                          value={talentDetails[index]?.billRate || ""}
                          onChange={(e) =>
                            handleTalentChange(
                              "billRate",
                              e.target.value,
                              index,
                              tmp_index
                            )
                          }
                          onInput={(e) =>
                            (e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ))
                          }
                        />
                        <span className="placeholder-right-text fw-medium position-absolute">
                          /hr
                        </span>
                      </div>
                      <div className="col-3" style={{ paddingRight: 12 }}>
                        <label htmlFor="budget" className="mb-1 fw-medium">
                          Currency
                        </label>
                        <Select
                          defaultValue={talentDetails[index]?.currency || ""}
                          onChange={(value) =>
                            handleTalentChange("currencies", value, index)
                          }
                          options={currencies}
                        />
                      </div>
                    </div>
                    <div className="col-6 flex-row d-flex ps-0">
                      <div
                        className="col-3 position-relative"
                        style={{ paddingRight: 12 }}
                      >
                        <label htmlFor="orderNumber" className="mb-1 fw-medium">
                          Standard Time BR
                        </label>
                        <input
                          className="d-block col-12 "
                          placeholder="Standard Time BR"
                          type="text"
                          id={`standardTime_${index}_${tmp_index}`}
                          name="standardTime"
                          value={talentDetails[index]?.standardTime || ""}
                          onChange={(e) =>
                            handleTalentChange(
                              "standardTime",
                              e.target.value,
                              index,
                              tmp_index
                            )
                          }
                          onInput={(e) =>
                            (e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ))
                          }
                        />
                        <span className="placeholder-right-text fw-medium position-absolute">
                          /hr
                        </span>
                      </div>
                      <div className="col-3" style={{ paddingRight: 12 }}>
                        <label htmlFor="budget" className="mb-1 fw-medium">
                          Currency
                        </label>
                        <Select
                          defaultValue={talentDetails[index]?.currency || ""}
                          onChange={(value) =>
                            handleTalentChange("currencies", value, index)
                          }
                          options={currencies}
                        />
                      </div>
                      <div
                        className="col-3 position-relative"
                        style={{ paddingRight: 12 }}
                      >
                        <label htmlFor="orderNumber" className="mb-1 fw-medium">
                          Over Time BR
                        </label>
                        <input
                          className="d-block col-12 "
                          placeholder="Over Time BR"
                          type="text"
                          id={`overTime_${index}_${tmp_index}`}
                          name="overTime"
                          value={talentDetails[index]?.overTime || ""}
                          onChange={(e) =>
                            handleTalentChange(
                              "overTime",
                              e.target.value,
                              index,
                              tmp_index
                            )
                          }
                          onInput={(e) =>
                            (e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ))
                          }
                        />
                        <span className="placeholder-right-text fw-medium position-absolute">
                          /hr
                        </span>
                      </div>
                      <div className="col-3">
                        <label htmlFor="budget" className="mb-1 fw-medium">
                          Currency
                        </label>
                        <Select
                          defaultValue={talentDetails[index]?.currency || ""}
                          onChange={(value) =>
                            handleTalentChange("currencies", value, index)
                          }
                          options={currencies}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-end align-items-center mt-5 ">
        <div
          className="pt-1 pb-2 px-3 d-flex justify-content-center align-items-center border border-dark fs-6 fw-medium rounded-pill lh-base me-2"
          style={{ cursor: "pointer" }}
          onClick={handleReset}
        >
          Reset
        </div>
        <div
          className="pt-1 pb-2 px-3 d-flex justify-content-center align-items-center fs-6 fw-medium rounded-pill lh-base"
          style={{
            cursor: "pointer",
            background: "#e8e8e8",
            color: "#898989",
          }}
          onClick={handleSave}
        >
          Save
        </div>
      </div>
    </form>
  );
};

export default PurchaseForm;
