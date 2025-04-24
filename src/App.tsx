import { useOutlet } from "react-router-dom";

function App() {

  const currentOutlet = useOutlet();

  return (
    <>
      <div>{currentOutlet}</div>
    </>
  )
}

export default App
