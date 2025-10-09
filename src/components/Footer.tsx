// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10">
      <center>
        <b>
          &copy; {new Date().getFullYear()} Expense Tracker | All Rights
          Reserved{" "}
        </b>
      </center>
    </footer>
  );
};

export default Footer;
