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
    <div
      className={`
    hidden
    `}
    ></div>
    <div className={`col-span-12 md:col-span-${col} space-y-4`}>{children}</div>
  </>
);

export const FullScreenLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e74949]"></div>
  </div>
);

export const ProfileImage = ({ src }: { src: Buffer }) => (
  <img
    src={`data:image/png;base64,${Buffer.from(src).toString("base64")}`}
    alt="Profile"
    className="rounded-full h-10 w-10 object-cover"
  />
);
