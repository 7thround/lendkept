import { Partner } from "@prisma/client";

interface WelcomePartnerProps {}

const WelcomePartner: React.FC<Readonly<WelcomePartnerProps>> = ({
  payload,
}: {
  payload: { partner: Partner };
}) => (
  <>
    <h3>Welcome to the team!</h3>
    <p>We are excited to have you on board, {payload.partner.name}!</p>
    <p>
      View your account details <a href={`https://www.lendkept.com`}>here</a>.
    </p>
  </>
);

export default WelcomePartner;
