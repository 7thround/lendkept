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
    md:col-span-1
    md:col-span-2
    md:col-span-3
    md:col-span-4
    md:col-span-5
    md:col-span-6
    md:col-span-7
    md:col-span-8
    md:col-span-9
    md:col-span-10
    md:col-span-11
    md:col-span-12
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
