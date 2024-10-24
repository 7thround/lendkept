import { LoanStatusLabels } from "../constants";

const loanTimelineStatuses = Object.keys(LoanStatusLabels).slice(0, 5);

const LoanTimeline = ({ currentStatus }) => {
  const activeStatusColor = (status) =>
    status === "LOAN_FUNDED" ? "bg-green-600" : "bg-[#e74949]";
  const inactiveStatuses = ["ON_HOLD", "CANCELLED", "NOT_QUALIFIED"];
  const isInactive = inactiveStatuses.includes(currentStatus);
  if (isInactive) {
    return (
      <div className="flex items-center justify-between space-x-4 p-4 bg-white rounded-lg mb-4 border overflow-x-auto">
        {loanTimelineStatuses.map((status, index) => (
          <div key={index} className="flex flex-col items-center min-w-max">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index <= loanTimelineStatuses.indexOf(currentStatus)
                  ? activeStatusColor(status) + " text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className={`mt-2 text-xs text-center`}>
              {LoanStatusLabels[status]}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between space-x-4 p-4 bg-white rounded-lg mb-4 border overflow-x-auto">
      {loanTimelineStatuses.map((status, index) => (
        <div key={index} className="flex flex-col items-center min-w-max">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              index <= loanTimelineStatuses.indexOf(currentStatus)
                ? activeStatusColor(status) + " text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <span className={`mt-2 text-xs text-center`}>
            {LoanStatusLabels[status]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LoanTimeline;
