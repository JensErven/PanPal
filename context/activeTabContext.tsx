import { createContext, useContext, useState } from "react";

export const ActiveTabContext = createContext(null);

export const ActiveTabContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = () => {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error("useActiveTab must be used within a ActiveTabProvider");
  }
  return context as {
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  };
};
