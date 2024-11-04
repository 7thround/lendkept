import {
  LoanStatusColors,
  LoanStatusLabels,
  StatusToolTips,
} from "../../constants";

const LoanStatusLabel = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-lg text-xs font-semibold text-white bg-${LoanStatusColors[status]}-500 pointer-events-none`}
    title={StatusToolTips[status]}
  >
    {LoanStatusLabels[status]}
  </span>
);

export default LoanStatusLabel;
