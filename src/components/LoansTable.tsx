import { Partner } from "@prisma/client";
import router from "next/router";
import { useEffect, useState } from "react";
import { LoanWithAddress } from "../../types";
import { LoanStatusLabels } from "../constants";
import { FullScreenLoader } from "./Layout/PageParts";

const LoansTable = ({
  affiliates = [],
  company,
  partner,
  partnerIds,
}: {
  affiliates?: Partner[];
  company?: { slug: string };
  partner?: Partner;
  partnerIds?: string;
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [referredByFilter, setReferredByFilter] = useState(
    partner ? partner.name : ""
  );
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loans, setLoans] = useState<LoanWithAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/loans?search=${search}&status=${statusFilter}&referredBy=${referredByFilter}&sortColumn=${sortColumn}&sortDirection=${sortDirection}${
          partnerIds ? `&partnerIds=${partnerIds}` : "0"
        }`
      );
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLoans();
  }, [search, statusFilter, referredByFilter, sortColumn, sortDirection]);
  return (
    <div>
      {loading && <FullScreenLoader />}
      {/* My Loans Panel */}
      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col flex-grow">
        <div className="flex px-4 py-2 justify-between items-center overflow-auto gap-2">
          <h2 className="text-xl font-semibold text-gray-900 shrink-0">
            Loans
          </h2>
          <div className="flex items-center">
            <input
              className="border border-gray-300 rounded-lg p-1 px-3"
              placeholder="Search by address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg p-1 px-3 ml-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.keys(LoanStatusLabels).map((status) => (
                <option key={status} value={status}>
                  {LoanStatusLabels[status]}
                </option>
              ))}
            </select>
            {!!affiliates?.length && (
              <select
                className="border border-gray-300 rounded-lg p-1 px-3 ml-2"
                value={referredByFilter}
                onChange={(e) => setReferredByFilter(e.target.value)}
              >
                {company && <option value="">All Affiliates</option>}
                {partner && (
                  <option value={partner.name}>{partner.name}</option>
                )}
                {affiliates.map((partner) => (
                  <option key={partner.id} value={partner.name}>
                    {partner.name}
                  </option>
                ))}
              </select>
            )}
            {company && (
              <button
                className="border border-[#e74949] text-[#e74949] py-1 px-3 rounded-lg ml-2"
                onClick={() => router.push(`${company.slug}/apply`)}
              >
                New Loan
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.length ? (
                loans.map((loan) => (
                  <tr
                    key={loan.id}
                    onClick={() => {
                      setLoading(true);
                      router.push(`/loans/${loan.id}`);
                    }}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {loan.address.addressLine1}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      ${loan.loanAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {LoanStatusLabels[loan.status]}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap text-center">
                      {/* @ts-ignore */}
                      {loan.partner ? loan.partner.name : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="py-2 px-4 whitespace-nowrap text-center"
                    colSpan={5}
                  >
                    <div>
                      {loans.length
                        ? ""
                        : loans.length
                        ? "No loans found"
                        : "No loans yet"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoansTable;
