import React, { createContext, ReactNode, useEffect, useState } from 'react';

const breakpointContext = createContext(0);

export const BreakpointProvider = (props: BreakpointProps) => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    // cleanup
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return <breakpointContext.Provider value={width}>{props.children}</breakpointContext.Provider>;
};

export const useBreakpoint = () => {
  return React.useContext(breakpointContext);
};

type BreakpointProps = {
  children: ReactNode;
};
