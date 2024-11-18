import { createContext, useState, useContext } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserPremium, setIsUserPremium] = useState(false);

  return (
    <MyContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isUserPremium, setIsUserPremium  }}
    >
      {children}
    </MyContext.Provider>
  );
};

const useSharedState = () => useContext(MyContext);

export { MyProvider, useSharedState };
