import LoanFunded from "./LoanFunded";
import LoanOfficerAdded from "./LoanOfficerAdded";
import LoanStatusUpdated from "./LoanStatusUpdated";
import LoanSubmitted from "./LoanSubmitted";
import NewLoanOfficer from "./NewLoanOfficer";
import NewNote from "./NewNote";
import NewPartner from "./NewPartner";
import WelcomePartner from "./WelcomePartner";

export interface EmailTemplatesInterface {
  LoanStatusUpdated: typeof LoanStatusUpdated;
  LoanFunded: typeof LoanFunded;
  LoanSubmitted: typeof LoanSubmitted;
  LoanOfficerAdded: typeof LoanOfficerAdded;
  NewNote: typeof NewNote;
  WelcomePartner: typeof WelcomePartner;
  NewPartner: typeof NewPartner;
  NewLoanOfficer: typeof NewLoanOfficer;
}

export const EmailTemplates = {
  LoanStatusUpdated: LoanStatusUpdated,
  LoanFunded: LoanFunded,
  LoanSubmitted: LoanSubmitted,
  LoanOfficerAdded: LoanOfficerAdded,
  NewNote: NewNote,
  WelcomePartner: WelcomePartner,
  NewPartner: NewPartner,
  NewLoanOfficer: NewLoanOfficer,
};
