const PongStyle = {
  container:
    'fixed top-0 left-0 w-full h-full m-0 p-0 overflow-hidden z-[9999]',
  canvas:
    'w-full h-full outline-none block',
  overlay:
    'absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black/70 text-white z-10 p-5 box-border overflow-y-auto',
  score:
    'absolute top-[10px] left-0 w-full text-center text-white text-lg sm:text-2xl font-bold z-5 px-[10px] box-border',
  button:
    'py-2 sm:py-3 px-4 sm:px-6 m-[10px] bg-[#4CAF50] text-white border-none rounded cursor-pointer transition-colors duration-300 max-w-full text-center text-sm sm:text-base',
  buttonDanger:
    'py-2 sm:py-3 px-4 sm:px-6 m-[10px] bg-[#d9534f] text-white border-none rounded cursor-pointer transition-colors duration-300 max-w-full text-center text-sm sm:text-base',
  title:
    'text-2xl sm:text-4xl text-center',
  subtitle:
    'text-xl sm:text-2xl text-center',
  normalText:
    'text-sm font-normal opacity-80',
  smallText:
    'text-xs sm:text-sm opacity-70 mt-5 text-center max-w-[90%] text-[#ccc]',
  viewModeText:
    'text-base font-normal opacity-80',
  viewIndicator:
    'text-sm font-normal opacity-70 mt-[5px]',
};

export default PongStyle;
