import React from "react";
import { Link } from "react-router-dom";

// Use a modern icon library like Font Awesome or Material Icons for a more polished look.
import { FaRegLightbulb, FaChartLine, FaWallet } from "react-icons/fa";

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Buttons at the top right */}
      <div style={styles.navbar}>
        <Link to="/Register" style={{ textDecoration: "none" }}>
          <button style={styles.navButton}>Register</button>
        </Link>
        <Link to="/Login" style={{ textDecoration: "none" }}>
          <button style={styles.navButton}>Login</button>
        </Link>
      </div>

      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome to the Expense Tracker</h1>
        <p style={styles.subheading}>Your personal finance assistant</p>
        <p style={styles.description}>
          Track your expenses effortlessly, stay on top of your budget, and make
          smarter financial decisions.
        </p>

        <div style={styles.benefitsContainer}>
          <div style={styles.benefitCard}>
            <FaRegLightbulb style={styles.icon} />
            <h3 style={styles.benefitHeading}>Save Smartly</h3>
            <p style={styles.benefitText}>
              Make informed financial decisions based on your spending patterns.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaChartLine style={styles.icon} />
            <h3 style={styles.benefitHeading}>Track Your Growth</h3>
            <p style={styles.benefitText}>
              Visualize your expenses and track your financial progress over
              time.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <FaWallet style={styles.icon} />
            <h3 style={styles.benefitHeading}>Budget Efficiently</h3>
            <p style={styles.benefitText}>
              Create personalized budgets and stick to them with ease.
            </p>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>Manage your expenses, save more!</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e2ede7ff, #6dd5ed)",
    fontFamily: "'Roboto', sans-serif",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
  },
  navbar: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "15px",
  },
  navButton: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    padding: "40px",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
    margin: "20px",
    backdropFilter: "blur(8px)",
  },
  heading: {
    fontSize: "42px",
    color: "#2c3e50",
    marginBottom: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  subheading: {
    fontSize: "20px",
    color: "#34495e",
    marginBottom: "24px",
    fontWeight: "400",
  },
  description: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
    fontWeight: "300",
    lineHeight: "1.6",
  },
  benefitsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
    gap: "20px",
  },
  benefitCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    width: "30%",
    textAlign: "center",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    fontSize: "40px",
    color: "#3498db",
    marginBottom: "15px",
  },
  benefitHeading: {
    fontSize: "20px",
    color: "#34495e",
    marginBottom: "10px",
    fontWeight: "600",
  },
  benefitText: {
    fontSize: "16px",
    color: "#555",
    fontWeight: "300",
  },
  footer: {
    marginTop: "40px",
    fontSize: "14px",
    color: "#95a5a6",
  },
  footerText: {
    color: "#95a5a6",
    fontStyle: "italic",
  },
};

export default Home;
