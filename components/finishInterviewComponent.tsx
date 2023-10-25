"use client";

import {Dispatch, SetStateAction, createContext, useState} from "react";

export const FinishInterviewContext = createContext<{
  isFinish: boolean;
  setIsFinish: Dispatch<SetStateAction<boolean>>;
} | null>(null);

const FinishInterviewContextComponent: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [isFinish, setIsFinish] = useState(false);
  return (
    <FinishInterviewContext.Provider value={{isFinish, setIsFinish}}>
      {children}
    </FinishInterviewContext.Provider>
  );
};

export default FinishInterviewContextComponent;
