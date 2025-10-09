import React from "react";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
