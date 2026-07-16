const fs = require('fs');
let code = fs.readFileSync('src/app/screens/Garden.tsx', 'utf-8');
// Fix missing import
code = code.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';");
fs.writeFileSync('src/app/screens/Garden.tsx', code);
