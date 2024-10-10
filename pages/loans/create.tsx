import React, { useState } from "react";

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    loanType: "SBA",
    loanAmount: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data to the server
    console.log(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl mb-8">Create Loan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block mb-2 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "loanAmount" ? "number" : "text"}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLoan;
