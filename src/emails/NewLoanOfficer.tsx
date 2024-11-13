interface NewLoanOfficerProps {}

const NewLoanOfficer: React.FC<Readonly<NewLoanOfficerProps>> = ({}: {}) => (
  <>
    <h3>Welcome to the team!</h3>
    <p>
      You can log in to your account{" "}
      <a href={`https://www.lendkept.com/`}>here</a>.
    </p>
  </>
);

export default NewLoanOfficer;
