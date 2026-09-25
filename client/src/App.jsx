import "./App.css";


function App() {
  const user = "Alice";

  return (
    <div className="header">
      <h1>ShelfLife</h1>
      <p>Welcome back, <strong>{user}</strong></p>
    </div>
  );
}

export default App;