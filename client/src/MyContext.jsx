import { createContext, useState, useContext } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState("");

  return (
    <MyContext.Provider
      value={{ isLoggedIn, setIsLoggedIn,membershipStatus, setMembershipStatus}}
    >
      {children}
    </MyContext.Provider>
  );
};

const useSharedState = () => useContext(MyContext);

export { MyProvider, useSharedState };
