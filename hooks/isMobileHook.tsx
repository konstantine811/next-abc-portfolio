import { useEffect, useState } from "react";

export enum DEVICE_SIZES {
  MOBILE = 768,
  TABLET = 1024,
  DESKTOP = 1536,
}

interface Props {
  size?: DEVICE_SIZES;
}

const useIsMobile = ({ size = DEVICE_SIZES.DESKTOP }: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < size);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize); // Add resize listener

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up listener on unmount
    };
  }, [size]);

  return isMobile;
};

export default useIsMobile;
