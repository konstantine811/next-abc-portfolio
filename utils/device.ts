export const isMacTouchpad = () => {
  const isMac =
    (navigator as any).userAgentData?.platform === "macOS" ||
    /Mac/.test(navigator.userAgent);

  const hasFinePointer =
    matchMedia("(pointer: fine)").matches &&
    matchMedia("(hover: hover)").matches;

  return isMac && hasFinePointer;
};
