const PongStyle = {
  container:
    'fixed top-0 left-0 w-full h-full m-0 p-0 overflow-hidden z-[9999]',
  canvas:
    'w-full h-full outline-none block',
  overlay:
    'absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black/70 text-white z-10 p-5 box-border overflow-y-auto',
  score:
    'absolute top-[10px] left-0 w-full text-center text-white font-bold z-5 px-[10px] box-border',
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
  touchControls:
    'fixed bottom-1 left-0 w-full flex justify-between items-center px-4 py-1 z-20 bg-transparent touch-manipulation',
  touchControlLeft:
    'flex flex-col space-y-2',
  touchControlRight:
    'flex flex-col space-y-2',
  touchButton:
    'w-12 h-12 bg-black/30 rounded-full flex items-center justify-center text-white touch-manipulation border border-white/30 active:bg-black/50 shadow-md transition-colors duration-200 backdrop-blur-sm',
  touchButtonPause:
    'w-10 h-10 bg-red-500/50 rounded-full flex items-center justify-center text-white touch-manipulation border border-white/30 active:bg-red-600/70 shadow-md transition-colors duration-200 backdrop-blur-sm',
  settingsSection:
    'bg-black/30 rounded-lg p-4 my-4 w-full max-w-md',
  settingsTitle:
    'text-xl mb-4 text-center',
  settingGroup:
    'mb-4',
  select:
    'w-full p-2 bg-black/50 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500',
  input:
    'w-full p-2 bg-black/50 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500',
};

export default PongStyle;
