export const PageContainer = ({ children }) => (
  <div className="grid grid-cols-12 gap-4">{children}</div>
);

export const Column = ({
  children,
  col,
}: {
  children: React.ReactNode;
  col: number;
}) => (
  <>
    <div className={`col-span-12 md:col-span-${col} space-y-4`}>{children}</div>
  </>
);
