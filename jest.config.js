export default {
   // Indicates whether the coverage information should be collected while executing the test
   collectCoverage: true,
 
   // An array of glob patterns indicating a set of files for which coverage information should be collected
   collectCoverageFrom: ['src/**/*.js'],
 
   // The directory where Jest should output its coverage files
   coverageDirectory: 'coverage',
 
   // Indicates which provider should be used to instrument code for coverage
   coverageProvider: 'v8',
 
   // A set of global variables that need to be available in all test environments
   globals: {
     'NODE_ENV': 'test'
   },
 
   // The test environment that will be used for testing
   testEnvironment: 'node',
 
   // The glob patterns Jest uses to detect test files
   testMatch: [
     '**/tests/**/*.js',
     '**/?(*.)+(spec|test).js'
   ],
 
   // Enable ES Modules support
   transform: {},
   
   // Indicates which files should be treated as ES modules
   extensionsToTreatAsEsm: ['.js'],
   
   // Module name mapper for ES modules
   moduleNameMapper: {
     '^(\\.{1,2}/.*)\\.js$': '$1'
   },
 
   // Automatically clear mock calls and instances between every test
   clearMocks: true,
 
   // Automatically reset mock state between every test
   resetMocks: true
 };