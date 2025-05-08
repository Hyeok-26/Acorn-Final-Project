import { useOutlet, useLocation } from "react-router-dom";
import CeoNavBar from "@/components/CeoNavBar";

function App() {
  const currentOutlet = useOutlet();
  const location = useLocation();
  const isCeoPage = location.pathname.includes('/ceo') || 
                   location.pathname.includes('/code') || 
                   location.pathname.includes('/store');

  return (
    <div className="flex">
      {isCeoPage && <CeoNavBar />}
      <div className="flex-1">{currentOutlet}</div>
    </div>
  )
}

export default App
