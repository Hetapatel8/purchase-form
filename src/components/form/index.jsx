import React, { useState, useEffect } from "react";
import Select from "react-select";
import { clientData, currencies, orderType } from "../../utils/formData";
import "react-datepicker/dist/react-datepicker.css";
import CustomDropdownIndicator from "../CustomDropdownIndicator";
import CustomClearIndicator from "../CustomClearIndicator";
import PurchaseDetailsSection from "../PurchaseDetailsSection";

const PurchaseForm = () => {
  const initialTalentDetail = {
    jobTitle: "",
    jobId: "",
    talents: [],
    talentDetails: [],
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

  const [isCheckedArray, setIsCheckedArray] = useState([]);
  const [isFormSaved, setIsFormSaved] = useState(false);

  useEffect(() => {
    setIsCheckedArray(
      new Array(talentDetails.length * talentDetails[0].talents.length).fill(
        false
      )
    );
  }, [talentDetails]);


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
          talents: job.talentData,
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
            jobTitle: value ? value.label : "",
            jobId: selectedJob ? selectedJob.value : "",
            talents: selectedJob ? selectedJob.talents : [],
            talentDetails: selectedJob
              ? selectedJob.talents.map(() => ({
                  contractDuration: "",
                  billRate: "",
                  standardTime: "",
                  overTime: "",
                  currency: "",
                }))
              : [],
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
      const newDetails = [...prevDetails];
      const talent = { ...newDetails[index] };

      if (tmpIndex < talent.talents.length) {
        talent.talentDetails[tmpIndex][name] = value;
        newDetails[index] = talent;
      }

      return newDetails;
    });
  };
  const addAnotherTalentSection = () => {
    const newTalentDetail = {
      jobTitle: "",
      jobId: "",
      talents: [],
      talentDetails: [
        {
          contractDuration: "",
          billRate: "",
          standardTime: "",
          overTime: "",
          currency: "",
        },
      ],
    };

    setTalentDetails((prevDetails) => [...prevDetails, newTalentDetail]);
  };
  const deleteTalentSection = (index) => {
    setTalentDetails((prevDetails) => {
      const newDetails = prevDetails.filter((_, i) => i !== index);
      return newDetails.length > 0 ? newDetails : [initialTalentDetail];
    });
  };
  const handleCheckboxChange = (e, index, tmp_index) => {
    const isChecked = e.target.checked;
    const orderType = formData.orderType?.value;
  
    const updatedCheckedArray = [...isCheckedArray];
    updatedCheckedArray[index * talentDetails[0].talents.length + tmp_index] = isChecked;
  
    if (orderType === "Individual PO") {
      const selectedCount = updatedCheckedArray.filter(Boolean).length;
      if (selectedCount > 1) {
        alert("Only 1 talent can be selected for Individual PO.");
        return;
      }
    }
  
    setIsCheckedArray(updatedCheckedArray);
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
    setIsFormSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
  
    const orderType = formData.orderType?.value;
  
    const checkedTalents = talentDetails
      .map((talent, index) => {
        const checkedTalentDetails = talent.talents
          .filter((tmp_talent, tmp_index) => {
            return isCheckedArray[index * talentDetails[0].talents.length + tmp_index] === true;
          })
          .map((tmp_talent, tmp_index) => {
            return {
              talentName: tmp_talent,
              contractDuration: talent.talentDetails[tmp_index].contractDuration,
              billRate: talent.talentDetails[tmp_index].billRate,
              standardTime: talent.talentDetails[tmp_index].standardTime,
              overTime: talent.talentDetails[tmp_index].overTime,
              currency: talent.talentDetails[tmp_index].currency,
            };
          });
  
        return {
          jobTitle: talent.jobTitle,
          jobId: talent.jobId,
          talents: checkedTalentDetails,
        };
      })
      .filter((talent) => talent.talents.length > 0); 
  
    const selectedTalentCount = checkedTalents.reduce(
      (total, talent) => total + talent.talents.length,
      0
    );
  
    if (orderType === "Individual PO" && selectedTalentCount !== 1) {
      alert("Please select exactly 1 talent for Individual PO.");
      return;
    }
  
    if (orderType === "Group PO" && selectedTalentCount < 2) {
      alert("Please select at least 2 talents for Group PO.");
      return;
    }
  
    const fullData = {
      formData,
      selectedOption,
      dates,
      talentDetails: checkedTalents,
    };
  
    console.log("Form Data", fullData);
    localStorage.setItem("formData", JSON.stringify(fullData));
    alert("Form saved successfully!");
    setIsFormSaved(true);
  };
  



  return (
    <form className="purchase_order_form px-md-4 px-3" onSubmit={handleSave}>
      <PurchaseDetailsSection
        formData={formData}
        selectedOption={selectedOption}
        dates={dates}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        isFormSaved={isFormSaved}
        setDates={setDates}
      />
      <div className=" mt-xxl-4 mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fs-5 lh-base fw-medium mb-0 text-black py-1">
            Talent Detail
          </h5>
          {formData.orderType?.value === "Group PO" && (
            <div
              className="pt-1 pb-md-2 pb-1 px-md-3 px-2 d-flex justify-content-between align-items-center border border-dark fs-6 fw-medium rounded-pill lh-base"
              style={{ cursor: "pointer" }}
              onClick={addAnotherTalentSection}
            >
              + Add Another
            </div>
          )}
        </div>
        <div className="accordion" id="accordionExample">
          {talentDetails.length > 0 &&
            talentDetails.map((talent, index) => (
              <div
                className="talent_detail_section mb-5 accordion-item border-0"
                key={index}
              >
                <div
                  className="row  mt-xxl-4 xl:mt-3 mt-4 accordion-header position-relative"
                  id={`heading${index}`}
                >
                  <div className="col-xl-6 col-12 flex-md-row flex-column d-flex mb-3">
                    <div
                      className="col-md-6 col-12 p-remove mb-md-0 mb-2"
                      style={{ paddingRight: 12 }}
                    >
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
                        components={{
                          DropdownIndicator: CustomDropdownIndicator,
                          ClearIndicator: CustomClearIndicator,
                        }}
                        value={
                          talent.jobTitle
                            ? { label: talent.jobTitle, value: talent.jobId }
                            : null
                        }
                        onChange={(value) =>
                          handleSelectChange("jobTitle", value, index)
                        }
                        options={jobOptions}
                        id="jobTitle"
                        name="jobTitle"
                        required
                        isDisabled={isFormSaved}
                        isClearable
                      />
                    </div>
                    <div
                      className="col-md-6 col-12 p-remove"
                      style={{ paddingLeft: 12 }}
                    >
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
                        disabled={isFormSaved}
                      />
                    </div>
                    <div onClick={() => deleteTalentSection(index)} className="position-absolute delete_talent d-flex justify-content-center align-items-center" style={{cursor: 'pointer', right: 52, marginBottom: -4, width: 22, height: 22}}>
                      <svg fill="#727281" width="22px" height="22px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="2" height="12"/><rect x="18" y="12" width="2" height="12"/><path d="M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"/><rect x="12" y="2" width="8" height="2"/></svg>
                    </div>
                    <button
                      type="button"
                      className="shadow-none bg-transparent p-0 position-absolute accordion-button collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                      style={{ right: 12, width: 20, height: 20 }}
                    ></button>
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
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse`}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body p-0">
                    {talent.talents.map((tmp_talent, tmp_index) => (
                      <div className="row mt-3" key={`${index}-${tmp_index}`}>
                        <label className="d-flex align-items-center position-relative talentCheckbox">
                          <input
                          className="position-absolute opacity-0 border-0 checkbox_input"
                          type="checkbox"
                          value=""
                          id={`talentCheckbox_${tmp_index}`}
                          checked={isCheckedArray[index * talentDetails[0].talents.length + tmp_index] || false} 

                          onChange={(e) => handleCheckboxChange(e, index, tmp_index)}

                          disabled={formData.orderType?.value === "Individual PO" && isCheckedArray.filter(Boolean).length === 1 && !isCheckedArray[index * talentDetails[0].talents.length + tmp_index]}
                          style={{
                            width: 18,
                            height: 18,
                            cursor: "pointer",
                          }}
                        />

                          <span
                            className="d-inline-flex align-items-center justify-content-center align-top rounded-1 gx-3 checkbox_control"
                            aria-hidden="true"
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
                          <div className="col-xxl-6 col-12 flex-md-row flex-column d-flex pe-xxl-0">
                            <div
                              className="col-xxl-6 col-md-4 col-12 mb-md-0 mb-2 position-relative p-remove"
                              style={{ paddingRight: 12 }}
                            >
                              <label
                                htmlFor={`contractDuration_${index}_${tmp_index}`}
                                className="mb-1 fw-medium"
                              >
                                Contract Duration
                              </label>
                              <input
                                className="d-block col-12 "
                                placeholder="Contract Duration"
                                type="text"
                                id={`contractDuration_${index}_${tmp_index}`}
                                name="contractDuration"
                                value={
                                  talent.talentDetails[tmp_index]
                                    .contractDuration || ""
                                }
                                disabled={isFormSaved}
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
                              className="col-xxl-3 col-md-4 mb-md-0 mb-2 position-relative p-remove"
                              style={{ paddingRight: 12 }}
                            >
                              <label
                                htmlFor={`billRate_${index}_${tmp_index}`}
                                className="mb-1 fw-medium"
                              >
                                Bill Rate
                              </label>
                              <input
                                className="d-block col-12 "
                                placeholder="Bill Rate"
                                type="text"
                                id={`billRate_${index}_${tmp_index}`}
                                name="billRate"
                                value={
                                  talent.talentDetails[tmp_index].billRate || ""
                                }
                                disabled={isFormSaved}
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
                            <div
                              className="col-xxl-3 col-md-4 p-remove"
                              style={{ paddingRight: 12 }}
                            >
                              <label className="mb-1 fw-medium">Currency</label>
                              <Select
                                components={{
                                  DropdownIndicator: CustomDropdownIndicator,
                                  ClearIndicator: CustomClearIndicator,
                                }}
                                defaultValue={
                                  talent.talentDetails[tmp_index].currency || ""
                                }
                                onChange={(value) =>
                                  handleTalentChange("currencies", value, index)
                                }
                                options={currencies}
                                isDisabled={isFormSaved}
                                isClearable
                              />
                            </div>
                          </div>
                          <div className="col-xxl-6 col-12 flex-md-row flex-column d-flex ps-xxl-0 mt-xxl-0 mt-3">
                            <div
                              className="col-md-3 col-12 position-relative mb-md-0 mb-2 p-remove"
                              style={{ paddingRight: 12 }}
                            >
                              <label
                                htmlFor={`standardTime_${index}_${tmp_index}`}
                                className="mb-1 fw-medium"
                              >
                                Standard Time BR
                              </label>
                              <input
                                className="d-block col-12 "
                                placeholder="Standard Time BR"
                                type="text"
                                id={`standardTime_${index}_${tmp_index}`}
                                name="standardTime"
                                value={
                                  talent.talentDetails[tmp_index]
                                    .standardTime || ""
                                }
                                onChange={(e) =>
                                  handleTalentChange(
                                    "standardTime",
                                    e.target.value,
                                    index,
                                    tmp_index
                                  )
                                }
                                disabled={isFormSaved}
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
                            <div
                              className="col-md-3 col-12 position-relative mb-md-0 mb-2 p-remove"
                              style={{ paddingRight: 12 }}
                            >
                              <label className="mb-1 fw-medium">Currency</label>
                              <Select
                                components={{
                                  DropdownIndicator: CustomDropdownIndicator,
                                  ClearIndicator: CustomClearIndicator,
                                }}
                                defaultValue={
                                  talent.talentDetails[tmp_index].currency || ""
                                }
                                onChange={(value) =>
                                  handleTalentChange("currencies", value, index)
                                }
                                options={currencies}
                                isDisabled={isFormSaved}
                                isClearable
                              />
                            </div>
                            <div
                              className="col-md-3 col-12 position-relative mb-md-0 mb-2 p-remove"
                              style={{ paddingRight: 12 }}
                            >
                              <label
                                htmlFor={`overTime_${index}_${tmp_index}`}
                                className="mb-1 fw-medium"
                              >
                                Over Time BR
                              </label>
                              <input
                                className="d-block col-12 "
                                placeholder="Over Time BR"
                                type="text"
                                id={`overTime_${index}_${tmp_index}`}
                                name="overTime"
                                value={
                                  talent.talentDetails[tmp_index].overTime || ""
                                }
                                onChange={(e) =>
                                  handleTalentChange(
                                    "overTime",
                                    e.target.value,
                                    index,
                                    tmp_index
                                  )
                                }
                                disabled={isFormSaved}
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
                            <div className="col-md-3 col-12 position-relative mb-md-0 mb-2">
                              <label className="mb-1 fw-medium">Currency</label>
                              <Select
                                components={{
                                  DropdownIndicator: CustomDropdownIndicator,
                                  ClearIndicator: CustomClearIndicator,
                                }}
                                defaultValue={
                                  talent.talentDetails[tmp_index].currency || ""
                                }
                                onChange={(value) =>
                                  handleTalentChange("currencies", value, index)
                                }
                                options={currencies}
                                isDisabled={isFormSaved}
                                isClearable
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
        <button
          className="border-0 pt-1 pb-2 px-3 d-flex justify-content-center align-items-center fs-6 fw-medium rounded-pill lh-base"
          style={{
            cursor: "pointer",
            background: "#e8e8e8",
            color: "#898989",
          }}
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PurchaseForm;
