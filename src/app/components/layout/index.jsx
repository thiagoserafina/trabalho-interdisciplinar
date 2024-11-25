import Sidebar from "../sidebar";

export default function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "20px",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
