import { Partner } from "@prisma/client";

interface NewPartnerProps {}

const NewPartner: React.FC<Readonly<NewPartnerProps>> = ({
  payload,
}: {
  payload: { partner: Partner };
}) => (
  <>
    <h4>{payload.partner.name} has joined the team!</h4>
    <p>
      View their account details <a href={`https://www.lendkept.com`}>here</a>.
    </p>
  </>
);

export default NewPartner;
