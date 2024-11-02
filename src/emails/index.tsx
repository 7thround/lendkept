import LoanFunded from "./LoanFunded";
import LoanOfficerAdded from "./LoanOfficerAdded";
import LoanStatusUpdated from "./LoanStatusUpdated";
import LoanSubmitted from "./LoanSubmitted";
import NewNote from "./NewNote";
import NewPartner from "./NewPartner";
import WelcomePartner from "./WelcomePartner";

export interface EmailTemplatesInterface {
  loanStatusUpdated: typeof LoanStatusUpdated;
  loanFunded: typeof LoanFunded;
  loanSubmitted: typeof LoanSubmitted;
  loanOfficerAdded: typeof LoanOfficerAdded;
  newNote: typeof NewNote;
  welcomePartner: typeof WelcomePartner;
  newPartner: typeof NewPartner;
}

export const EmailTemplates = {
  loanStatusUpdated: LoanStatusUpdated,
  loanFunded: LoanFunded,
  loanSubmitted: LoanSubmitted,
  loanOfficerAdded: LoanOfficerAdded,
  newNote: NewNote,
  welcomePartner: WelcomePartner,
  newPartner: NewPartner,
};
