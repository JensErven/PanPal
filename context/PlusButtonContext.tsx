import { useNavigation } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

export const PlusButtonContext = createContext(null);

// Create the context provider
export const PlusButtonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPlusButtonPressed, setIsPlusButtonPressed] =
    useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Listen for navigation state changes
    const unsubscribe = navigation.addListener("state", () => {
      setIsPlusButtonPressed(false); // Set isPlusButtonPressed to false on route change
    });
    // Unsubscribe when component unmounts
    return unsubscribe;
  }, [navigation]);

  return (
    <PlusButtonContext.Provider
      value={{ isPlusButtonPressed, setIsPlusButtonPressed }}
    >
      {children}
    </PlusButtonContext.Provider>
  );
};

// Custom hook to consume the context
export const usePlusButton = () => {
  const context = useContext(PlusButtonContext);
  if (!context) {
    throw new Error("usePlusButton must be used within a PlusButtonProvider");
  }
  return context as {
    isPlusButtonPressed: boolean;
    setIsPlusButtonPressed: React.Dispatch<React.SetStateAction<boolean>>;
  };
};
