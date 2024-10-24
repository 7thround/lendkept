import React, { useEffect, useState } from "react";
import {
  Column,
  PageContainer,
} from "../../../src/components/Layout/PageParts";
import prisma from "../../../lib/prisma";
import { Company, Partner } from "@prisma/client";
import { getUser } from "../..";
import cookie from "cookie";
import { LoanWithAddress } from "../../../types";
import LoanTimeline from "../../../src/components/LoanTimeline";

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const loan = await prisma.loan.findUnique({
    where: { id: Number(id) },
    include: {
      address: true,
      borrowers: true,
    },
  });

  const serializedLoan = {
    ...loan,
    borrowers: loan.borrowers.map((borrower) => ({
      ...borrower,
      createdAt: borrower.createdAt.toISOString(),
    })),
  };

  let partner = null;
  if (loan.partnerId) {
    partner = await prisma.partner.findUnique({
      where: { id: loan.partnerId },
    });
  }
  const company = await prisma.company.findUnique({
    where: { id: loan.companyId },
  });

  const { req } = context;
  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies || "");
  const token = parsedCookies.token;

  return {
    props: {
      loan: serializedLoan,
      partner,
      company,
      user: await getUser(token),
    },
  };
};

const LoanPage = ({
  loan,
  partner,
  company,
}: {
  loan: LoanWithAddress;
  partner: Partner;
  company: Company;
}) => {
  const addNote = async (note) => {
    const response = await fetch(`/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      const newNote = await response.json();
      window.location.reload();
      console.log("Note added:", newNote);
    }
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "Initial message", sender: "Partner" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState("");
  const [formData, setFormData] = useState<{
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    loanType: string;
    loanAmount: number;
    status: string;
  }>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    loanType: "",
    loanAmount: 0,
    status: "",
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/loans/${loan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: loan.addressId,
          ...formData,
        }),
      });

      if (response.ok) {
        const updatedLoan = await response.json();
        console.log("Loan updated:", updatedLoan);
        window.location.reload();
      } else {
        console.error("Failed to update loan");
      }
    } catch (error) {
      console.error("Error updating loan:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const [activities, setActivities] = useState([
    { id: 1, description: "Application submitted", date: new Date() },
    { id: 2, description: "Credit check completed", date: new Date() },
    { id: 3, description: "Loan approved", date: new Date() },
  ]);

  const [accessCode, setAccessCode] = useState("");
  useEffect(() => {
    const accessCodeQueryParam = new URLSearchParams(
      window.location.search
    ).get("access_code");
    if (accessCodeQueryParam) {
      setAccessCode(accessCodeQueryParam);
    }
  }, []);
  const [isAccessCodeValid, setIsAccessCodeValid] = useState(false);

  const handleVerifyAccessCode = () => {
    if (accessCode === loan.accessCode) {
      setIsAccessCodeValid(true);
    }
  };

  if (!loan) {
    return (
      <PageContainer>
        <Column col={12}>
          <div className="bg-white shadow rounded-lg p-4 flex-grow">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Loan Details
            </h1>
            <p className="text-gray-700">Loan not found</p>
          </div>
        </Column>
      </PageContainer>
    );
  }

  if (!isAccessCodeValid) {
    return (
      <PageContainer>
        <Column col={12}>
          <div className="bg-white shadow rounded-lg p-4 items-center text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Loan Details
            </h1>
            <p className="text-gray-700">
              Enter the access code to view the loan
            </p>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="border border-gray-300 rounded p-2 mt-2"
              placeholder="Access code"
            />
            <button
              onClick={handleVerifyAccessCode}
              className="px-4 py-2 bg-[#e74949] text-white rounded mt-2 ml-2 hover:bg-[#e74949]"
            >
              Verify
            </button>
          </div>
        </Column>
      </PageContainer>
    );
  }
  return (
    <>
      <PageContainer>
        <Column col={12}>
          <div className="bg-white shadow rounded-lg pt-2 p-4 flex-grow">
            <h1 className="text-xl text-center font-semibold pb-2">
              Loan Timeline
            </h1>
            <LoanTimeline currentStatus={loan.status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Client Information
                </h2>
                <div className="flex gap-4 flex-col">
                  {loan.borrowers.map((borrower, index) => (
                    <div key={borrower.id}>
                      {borrower.coBorrower && (
                        <p className="text-gray-900">Co-Borrower</p>
                      )}
                      <p>
                        <strong>Name: </strong>
                        {borrower.firstName} {borrower.lastName}
                      </p>
                      <p>
                        <strong>Phone:</strong> {borrower.phone}
                      </p>
                      <p>
                        <strong>Email:</strong> {borrower.email}
                      </p>
                      <p>
                        <strong>Employer:</strong> {borrower.employer}
                      </p>
                      <p>
                        <strong>Position:</strong> {borrower.position}
                      </p>
                      <p>
                        <strong>Income:</strong> $
                        {borrower.income.toLocaleString()}
                      </p>
                      <p>
                        <strong>Credit:</strong> {borrower.credit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Property Address
                </h2>
                <p>
                  <strong>Line 1:</strong> {loan.address.addressLine1}
                </p>
                <p>
                  <strong>Line 2:</strong> {loan.address.addressLine2}
                </p>
                <p>
                  <strong>City:</strong> {loan.address.city}
                </p>
                <p>
                  <strong>State:</strong> {loan.address.state}
                </p>
                <p>
                  <strong>ZIP:</strong> {loan.address.zip}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex justify-between">
                  Loan Details
                </h2>
                <p>
                  <strong>Type:</strong> {loan.loanType}
                </p>
                <p>
                  <strong>Amount:</strong> ${loan.loanAmount.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {loan.status}
                </p>
                <p>
                  <strong>Paid:</strong> {loan.paid ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Partner & Company
                </h2>
                {partner && (
                  <p>
                    <strong>Affiliate Partner:</strong> {partner.name}
                  </p>
                )}
                <p>
                  <strong>Company</strong> {company.name}
                </p>
              </div>
            </div>
          </div>
        </Column>
      </PageContainer>
    </>
  );
};

export default LoanPage;
