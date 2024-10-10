import { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/20/solid";
import LogoutButton from "../LogoutButton";
import { useRouter } from "next/router";

const CompanyPortal = () => {
  const router = useRouter();
  const [loans, setLoans] = useState([
    {
      id: 1,
      address: "123 Main St",
      status: "PROCESSING",
      partner: "John Doe",
    },
    {
      id: 2,
      address: "456 Elm St",
      status: "FUNDED",
      partner: "Jane Doe",
    },
    {
      id: 3,
      address: "789 Oak St",
      status: "CANCELLED",
      partner: "John Smith",
    },
    // Add more loans as needed
  ]);

  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
    // Add more messages as needed
  ]);

  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [partners, setPartners] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "555-555-5555",
    },
    // Add more partners as needed
  ]);

  const handleStatusChange = (loanId, newStatus) => {
    setLoans(
      loans.map((loan) =>
        loan.id === loanId ? { ...loan, status: newStatus } : loan
      )
    );
  };

  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
  };

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    // Implement update logic here
  };

  const handleProcessPayouts = () => {
    // Implement payout processing logic here
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <main className="flex-grow p-4 flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Left Column */}
          <div className="flex-grow flex flex-col space-y-4">
            {/* Loans Panel */}
            <div className="bg-white shadow rounded-lg py-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 px-4">
                Loans
              </h2>
              <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan ID
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {loan.id}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {loan.address}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <select
                            className="border border-gray-300 rounded-lg p-2"
                            value={loan.status}
                            onChange={(e) =>
                              handleStatusChange(loan.id, e.target.value)
                            }
                          >
                            <option value="SUBMITTED" disabled>
                              Submitted
                            </option>
                            <option value="PROCESSING">Processing</option>
                            <option value="FUNDED">Funded</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {loan.partner}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => router.push(`/loans/${loan.id}`)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Partners Panel */}
            <div className="bg-white shadow rounded-lg py-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 px-4">
                Partners
              </h2>
              <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner ID
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <tr key={partner.id}>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.id}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.name}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.email}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {partner.phone}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          <button
                            disabled
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            disabled
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4 w-full lg:w-1/3">
            {/* Company Details Panel */}
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Company Details
              </h2>
              <form onSubmit={handleUpdateDetails}>
                <div className="mb-4">
                  <label className="block text-gray-700">Company Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Company Name"
                    value={companyDetails.name}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Address"
                    value={companyDetails.address}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Phone"
                    value={companyDetails.phone}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg">
                  Update Details
                </button>
              </form>
            </div>

            {/* Payouts Panel */}
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payouts
              </h2>
              <p>Manage your partner payouts here.</p>
              <button
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={handleProcessPayouts}
              >
                Process Payouts
              </button>
            </div>
          </div>
        </div>

        {/* Message Center Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Message Center
          </h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2"
            rows={5}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-4">
            Message History
          </h3>
          <ul className="divide-y divide-gray-200">
            {messageHistory.map((msg, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <span>{msg}</span>
                <div>
                  <button className="text-blue-600 hover:text-blue-900 mr-2">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-900">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CompanyPortal;
