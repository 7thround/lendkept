import { User } from "@prisma/client";

interface ResetPasswordProps {}

const ResetPassword: React.FC<Readonly<ResetPasswordProps>> = ({
  payload,
}: {
  payload: { user: User };
}) => (
  <>
    <p>Reset your password</p>
    <p>
      Click{" "}
      <a
        href={`https://www.lendkept.com/reset-password?token=${payload.user.id}`}
      >
        here
      </a>{" "}
      to reset your password.
    </p>
  </>
);

export default ResetPassword;
