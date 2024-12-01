import Sidebar from "../sidebar";

export default function Layout({ children, title }) {
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
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h1
          style={{
            fontSize: 25,
            alignSelf: "start",
            marginBottom: 20,
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: "#fed50a",
            textDecorationThickness: "3px",
            textUnderlineOffset: "8px",
          }}
        >
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
