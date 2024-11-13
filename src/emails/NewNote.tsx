import { Loan, Note } from "@prisma/client";

interface NewNoteProps {}

const NewNote: React.FC<Readonly<NewNoteProps>> = ({
  payload,
}: {
  payload: { note: Note; loan: Loan };
}) => (
  <>
    <h3>A New Note Has Been Added</h3>
    <blockquote>"{payload.note.text}"</blockquote>
    <p>
      View the more details{" "}
      <a href={`https://www.lendkept.com/loans/${payload.loan.id}`}>here</a>.
    </p>
  </>
);

export default NewNote;
