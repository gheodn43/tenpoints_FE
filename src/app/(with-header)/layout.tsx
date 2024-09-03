import Header from '../../components/Header';

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
      <><Header /><main>{children}</main></>
  );
}
