const PongStyle = {
  container: 'relative w-full h-[600px] bg-black rounded-xl flex justify-center items-center overflow-hidden',
  containerFullscreen: 'fixed inset-0 z-50 bg-black flex justify-center items-center overflow-hidden',

  gameArea: 'relative w-full h-full flex justify-center items-center',

  paddle: {
    base: 'absolute h-20 w-3 bg-white rounded-md',
    left: 'left-4',
    right: 'right-4',
    // Styles pour mode mobile (rotation 90 degrés)
    mobile: {
      base: 'absolute h-3 w-20 bg-white rounded-md',
      top: 'top-4',
      bottom: 'bottom-4',
    },
  },

  ball: 'absolute h-4 w-4 bg-white rounded-full',

  scoreBoard: 'absolute top-4 text-white text-4xl flex w-full justify-center',
  scoreLeft: 'mr-12',
  scoreRight: 'ml-12',
  // Tableau de score pour mode mobile
  scoreBoardMobile: 'absolute right-4 text-white text-4xl flex flex-col h-full justify-center',
  scoreTop: 'mb-12',
  scoreBottom: 'mt-12',

  centerLine: 'absolute h-full w-0.5 bg-white opacity-40',
  // Ligne centrale pour mode mobile
  centerLineMobile: 'absolute w-full h-0.5 bg-white opacity-40',

  menu: {
    overlay: 'absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-10',
    title: 'text-white text-5xl mb-8',
    button: 'bg-white text-black py-3 px-6 rounded-lg text-xl my-2 hover:bg-gray-200 transition-colors',
  },

  // Style pour le compteur
  countdown: 'absolute text-white text-8xl z-10 font-bold',

  // Bouton plein écran
  fullscreenButton: 'absolute top-4 right-4 bg-white bg-opacity-20 text-white py-1 px-2 rounded-lg text-sm hover:bg-opacity-40 transition-colors z-20',

  // Icônes pour le mode plein écran
  fullscreenIcon: 'w-5 h-5',
};

export default PongStyle;
