import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Rank calculation logic based on Allen data
const fetchRank = (marksInput:number | string) => {
  const marks = Number(marksInput);
  if (marks < 0 || marks > 720) {
    return "Invalid Marks";
  }
  
  let minRank = 0;
  let maxRank = 0;
  
  // Marks vs Ranks table
  if (marks >= 680 && marks <= 720) {
    minRank = 1;
    maxRank = 10;
  } else if (marks >= 651 && marks <= 679) {
    minRank = 11;
    maxRank = 100;
  } else if (marks >= 616 && marks <= 650) {
    minRank = 101;
    maxRank = 500;
  } else if (marks >= 596 && marks <= 615) {
    minRank = 501;
    maxRank = 1000;
  } else if (marks >= 548 && marks <= 595) {
    minRank = 1001;
    maxRank = 5000;
  } else if (marks >= 531 && marks <= 547) {
    minRank = 5001;
    maxRank = 10000;
  } else if (marks >= 513 && marks <= 530) {
    minRank = 10001;
    maxRank = 20000;
  } else if (marks >= 491 && marks <= 512) {
    minRank = 20001;
    maxRank = 35000;
  } else if (marks >= 474 && marks <= 490) {
    minRank = 35001;
    maxRank = 50000;
  } else if (marks >= 423 && marks <= 473) {
    minRank = 50001;
    maxRank = 100000;
  } else if (marks >= 352 && marks <= 422) {
    minRank = 100001;
    maxRank = 200000;
  } else if (marks >= 224 && marks <= 351) {
    minRank = 200001;
    maxRank = 500000;
  } else {
    minRank = 500001;
    maxRank = 1000000;
  }
  
  // Get range width for more realistic rank variation
  const getMarksRangeWidth = (marks:number) => {
    if (marks >= 680 && marks <= 720) return 40;
    if (marks >= 651 && marks <= 679) return 29;
    if (marks >= 616 && marks <= 650) return 35;
    if (marks >= 596 && marks <= 615) return 20;
    if (marks >= 548 && marks <= 595) return 48;
    if (marks >= 531 && marks <= 547) return 17;
    if (marks >= 513 && marks <= 530) return 18;
    if (marks >= 491 && marks <= 512) return 22;
    if (marks >= 474 && marks <= 490) return 17;
    if (marks >= 423 && marks <= 473) return 51;
    if (marks >= 352 && marks <= 422) return 71;
    if (marks >= 224 && marks <= 351) return 128;
    return 1;
  };
  
  // Get max marks for the range
  const getRangeMaxMarks = (marks:number) => {
    if (marks >= 680 && marks <= 720) return 720;
    if (marks >= 651 && marks <= 679) return 679;
    if (marks >= 616 && marks <= 650) return 650;
    if (marks >= 596 && marks <= 615) return 615;
    if (marks >= 548 && marks <= 595) return 595;
    if (marks >= 531 && marks <= 547) return 547;
    if (marks >= 513 && marks <= 530) return 530;
    if (marks >= 491 && marks <= 512) return 512;
    if (marks >= 474 && marks <= 490) return 490;
    if (marks >= 423 && marks <= 473) return 473;
    if (marks >= 352 && marks <= 422) return 422;
    if (marks >= 224 && marks <= 351) return 351;
    return marks;
  };
  
  // Calculate base predicted rank
  const rankPerMark = (maxRank - minRank) / (getMarksRangeWidth(marks) || 1);
  const offset = Math.floor(rankPerMark * (getRangeMaxMarks(marks) - marks));
  let predictedMin = minRank + offset;
  
  // Calculate a reasonable range - different strategies based on rank tier
  let predictedMax;
  
  // For top ranks (1-100), create a small but meaningful range
  if (predictedMin <= 10) {
    predictedMax = predictedMin + 2;
  } else if (predictedMin <= 100) {
    predictedMax = predictedMin + Math.max(5, Math.floor(predictedMin * 0.1));
  } else if (predictedMin <= 1000) {
    predictedMax = predictedMin + Math.max(20, Math.floor(predictedMin * 0.08));
  } else if (predictedMin <= 10000) {
    predictedMax = predictedMin + Math.max(200, Math.floor(predictedMin * 0.07));
  } else if (predictedMin <= 50000) {
    predictedMax = predictedMin + Math.max(1000, Math.floor(predictedMin * 0.06));
  } else {
    predictedMax = predictedMin + Math.max(2000, Math.floor(predictedMin * 0.05));
  }
  
  // Ensure we don't exceed the maximum rank for the range
  predictedMax = Math.min(predictedMax, maxRank);
  
  // Ensure we always have at least some range (even for rank 1)
  if (predictedMin === 1) {
    predictedMax = 3;
  }
  
  return `${predictedMin.toLocaleString()} - ${predictedMax.toLocaleString()}`;
};

export default function NEETRankCalculator() {
  const [marks, setMarks] = useState('');
  const [rank, setRank] = useState<number | null | string>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  
  const handleSubmit = () => {
    // Input validation
    if (!marks) {
      setError('Please enter your NEET marks');
      return;
    }
    
    const numMarks = parseInt(marks);
    if (isNaN(numMarks)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (numMarks < 0 || numMarks > 720) {
      setError('NEET marks should be between 0 and 720');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setRank(fetchRank(numMarks));
      setLoading(false);
    }, 800);
  };
  
  // Dynamic classes based on theme
  const themeClasses = {
    background: darkMode 
      ? 'bg-gradient-to-br from-violet-900 via-purple-400 to-gray-900' 
      : 'bg-gradient-to-br from-indigo-500 via-blue-450 to-sky-200',
    card: darkMode 
      ? 'bg-gray-800/80 backdrop-blur-sm border-purple-900/30' 
      : 'bg-white/90 backdrop-blur-sm border-indigo-100/50',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    subtext: darkMode ? 'text-gray-300' : 'text-gray-600',
    muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200',
    input: darkMode 
      ? 'bg-gray-700/70 border-purple-900/30 text-gray-100 placeholder-gray-500 focus:border-purple-500' 
      : 'bg-white/90 border-indigo-100 text-gray-800 placeholder-gray-400 focus:border-indigo-500',
    button: darkMode 
      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' 
      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white',
    accent: darkMode ? 'text-purple-400' : 'text-indigo-600',
    resultBox: darkMode 
      ? 'bg-gradient-to-r from-purple-900/30 to-gray-800/50 border-purple-900/30' 
      : 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100/50',
    toggleBtn: darkMode
      ? 'bg-gray-700/70 text-purple-300'
      : 'bg-gray-200/70 text-indigo-600'
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 10 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const buttonHover = {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  
  
  return (
    <motion.div 
      className={`flex flex-col min-h-screen ${themeClasses.background} transition-colors duration-500`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header with logo and theme toggle */}
      <motion.header 
        className={`w-full ${darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-lg p-4 transition-colors duration-500`}
        variants={slideUp}
      >
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <motion.div 
              className={`h-10 w-10 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-indigo-700'} rounded-full flex items-center justify-center shadow-lg transition-colors duration-500`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white font-bold text-xl">N</span>
            </motion.div>
            <h1 className={`${themeClasses.text} text-2xl font-light tracking-wide`}>
              NEET <span className="font-semibold">Predictor</span>
            </h1>
          </motion.div>
          
          <motion.button 
            onClick={() => setDarkMode(!darkMode)}
            className={`${themeClasses.toggleBtn} p-2 rounded-full transition-colors duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.header>

      <main className="w-full max-w-3xl mx-auto p-4 md:p-6 flex-grow flex flex-col items-center justify-center">
        <motion.div 
          className={`w-full ${themeClasses.card} rounded-xl shadow-xl p-6 md:p-8 mb-6 border transition-colors duration-500`}
          variants={slideUp}
        >
          <motion.h2 
            className={`${themeClasses.accent} text-3xl font-extralight tracking-wider mb-2 text-center`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            NEET Rank Calculator
          </motion.h2>
          <motion.p 
            className={`${themeClasses.subtext} mb-8 pb-4 border-b ${themeClasses.border} font-light tracking-wide transition-colors duration-500 text-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Estimate your All India Rank based on your NEET-UG examination score
          </motion.p>
          
          <motion.div 
            className="space-y-6 max-w-xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={slideUp}>
              <label htmlFor="marks" className={`block text-sm font-medium ${themeClasses.subtext} mb-2`}>
                NEET Marks (0-720)
              </label>
              <div className="relative">
                <motion.input
                  id="marks"
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="Enter your marks"
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full px-4 py-4 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'} pr-12 transition-colors duration-500 shadow-md`}
                />
                <motion.span 
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.muted}`}
                  animate={{ opacity: marks ? 1 : 0.5 }}
                >
                  / 720
                </motion.span>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    className="mt-2 text-sm text-red-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={buttonHover}
              whileTap={{ scale: 0.98 }}
              variants={slideUp}
              className={`w-full ${themeClasses.button} font-medium py-4 px-6 rounded-lg shadow-md transition duration-500`}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Calculate Your Rank'
              )}
            </motion.button>
          </motion.div>
          
          <AnimatePresence>
            {rank && (
              <motion.div 
                className="mt-8 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <motion.div 
                  className={`p-6 ${themeClasses.resultBox} rounded-lg border shadow-md transition-colors duration-500`}
                  
                >
                  <motion.h3 
                    className={`font-light text-xl ${themeClasses.accent} mb-3 text-center`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your Estimated Rank
                  </motion.h3>
                  <motion.div 
                    className={`${themeClasses.text} text-2xl font-semibold text-center`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {rank}
                  </motion.div>
                  <motion.p
                    className={`${themeClasses.muted} text-xs mt-4 text-center italic`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    * Based on data from Allen Career Institute. Actual results may vary.
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          className={`w-full ${themeClasses.card} rounded-xl shadow-xl p-6 md:p-8 border transition-colors duration-500`}
          variants={slideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <motion.h3 
            className={`text-xl font-light tracking-wide ${themeClasses.text} mb-4 text-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            About NEET Examination
          </motion.h3>
          <motion.div 
            className={`${themeClasses.subtext} space-y-4 font-light`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <motion.p variants={slideUp}>
              The National Eligibility cum Entrance Test (NEET) is the qualifying test for MBBS and BDS programs in Indian medical and dental colleges. The test is conducted by the National Testing Agency (NTA).
            </motion.p>
            <motion.p variants={slideUp}>
              NEET consists of 180 multiple-choice questions from Physics, Chemistry, and Biology (Botany & Zoology). Each correct answer is awarded 4 marks, while each incorrect answer results in a deduction of 1 mark.
            </motion.p>
            <motion.p variants={slideUp}>
              The maximum marks that can be obtained in the NEET exam is 720. Candidates need to score above the cutoff to qualify for admission to medical colleges across India.
            </motion.p>
          </motion.div>
        </motion.div>
      </main>
      
      <motion.footer 
        className={`w-full ${darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} py-6 transition-colors duration-500`}
        variants={slideUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="mb-4 md:mb-0 text-center md:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className={`font-light text-lg ${themeClasses.text} mb-2`}>
                NEET <span className="font-medium">Predictor</span>
              </h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-light`}>
                Helping students estimate their NEET ranks and plan their future
              </p>
            </motion.div>
            
           
        </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}