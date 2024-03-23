import { useState } from "react";
import SettingsPage from "./SettingsPage";
import MenusPage from "./MenusPage";
import LogsPage from "./LogsPage";

const navs = ["Settings", "Menus", "Logs"];

const pages: { [key: string]: JSX.Element } = {
  Settings: <SettingsPage />,
  Menus: <MenusPage />,
  Logs: <LogsPage />
};

export default function () {
  const [activeTab, setActiveTab] = useState(navs[0]);
  return (
    <div id="index-page">
      <div className="nav-box">
        {navs.map((n) => (
          <label key={n} className={activeTab === n ? "active" : ""}>
            <input
              type="radio"
              value={n}
              onChange={() => setActiveTab(n)}
              checked={activeTab === n}
            />
            {n}
          </label>
        ))}
      </div>
      {pages[activeTab]}
    </div>
  );
}
