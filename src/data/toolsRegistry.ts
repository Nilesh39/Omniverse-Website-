export interface ToolDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  componentName: string;
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // DEVELOPER TOOLS
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, validate, repair, and minify JSON data with color highlighting.',
    category: 'developer',
    icon: 'FileJson',
    keywords: ['json', 'format', 'beautify', 'validate', 'minify', 'developer'],
    popular: true,
    featured: true,
    componentName: 'JsonFormatter'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Token Decoder',
    description: 'Decode JSON Web Tokens, inspect header, payload, expiration & signature claims.',
    category: 'developer',
    icon: 'KeyRound',
    keywords: ['jwt', 'token', 'decode', 'auth', 'bearer', 'security'],
    popular: true,
    featured: true,
    componentName: 'JwtDecoder'
  },
  {
    id: 'regex-tester',
    title: 'Regex Expression Tester',
    description: 'Real-time Regular Expression testing with match highlighting and cheatsheet.',
    category: 'developer',
    icon: 'FileCode',
    keywords: ['regex', 'pattern', 'test', 'match', 'string', 'replace'],
    popular: true,
    componentName: 'RegexTester'
  },
  {
    id: 'base64-converter',
    title: 'Base64 Encoder / Decoder',
    description: 'Encode strings and files to Base64 format or decode back to plain text.',
    category: 'developer',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'string', 'binary'],
    popular: true,
    componentName: 'Base64Converter'
  },
  {
    id: 'hash-generator',
    title: 'Cryptographic Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.',
    category: 'developer',
    icon: 'Fingerprint',
    keywords: ['hash', 'md5', 'sha256', 'sha512', 'crypto', 'checksum'],
    popular: true,
    componentName: 'HashGenerator'
  },
  {
    id: 'uuid-generator',
    title: 'UUID / GUID Generator',
    description: 'Generate bulk cryptographically secure Version 4 UUIDs.',
    category: 'developer',
    icon: 'Sparkles',
    keywords: ['uuid', 'guid', 'unique', 'id', 'random', 'generator'],
    componentName: 'UuidGenerator'
  },
  {
    id: 'html-escaper',
    title: 'HTML Entity Escaper & Unescaper',
    description: 'Safely convert HTML special characters to entities and back.',
    category: 'developer',
    icon: 'Code',
    keywords: ['html', 'entities', 'escape', 'sanitize', 'web'],
    componentName: 'HtmlEscaper'
  },
  {
    id: 'sql-formatter',
    title: 'SQL Code Formatter',
    description: 'Beautify complex SQL queries with standard indentation and keyword uppercase.',
    category: 'developer',
    icon: 'Database',
    keywords: ['sql', 'query', 'format', 'database', 'beautify'],
    componentName: 'SqlFormatter'
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode and decode query strings and special characters for web URLs.',
    category: 'developer',
    icon: 'Link',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent'],
    componentName: 'UrlEncoder'
  },
  {
    id: 'css-minifier',
    title: 'CSS / JS Code Minifier',
    description: 'Compress CSS and JavaScript snippets to optimize bundle sizes.',
    category: 'developer',
    icon: 'Minimize2',
    keywords: ['css', 'js', 'minify', 'compress', 'code'],
    componentName: 'CodeMinifier'
  },
  {
    id: 'cron-parser',
    title: 'Cron Schedule Expression Parser',
    description: 'Parse cron expressions into human-readable next execution dates.',
    category: 'developer',
    icon: 'CalendarDays',
    keywords: ['cron', 'schedule', 'expression', 'parser', 'timer'],
    componentName: 'CronParser'
  },
  {
    id: 'diff-checker',
    title: 'Text & Code Diff Checker',
    description: 'Compare two text snippets side-by-side to highlight added/deleted lines.',
    category: 'developer',
    icon: 'GitCompare',
    keywords: ['diff', 'compare', 'text', 'code', 'git'],
    popular: true,
    componentName: 'DiffChecker'
  },

  // STUDENT & MATH TOOLS
  {
    id: 'scientific-calculator',
    title: 'Scientific & Graphic Calculator',
    description: 'Full scientific calculator with trigonometric, logarithmic, and memory functions.',
    category: 'student',
    icon: 'Calculator',
    keywords: ['calculator', 'scientific', 'math', 'trig', 'log', 'expression'],
    popular: true,
    featured: true,
    componentName: 'ScientificCalculator'
  },
  {
    id: 'cgpa-calculator',
    title: 'CGPA & GPA Grade Calculator',
    description: 'Calculate Cumulative Grade Point Average across multiple semesters.',
    category: 'student',
    icon: 'GraduationCap',
    keywords: ['cgpa', 'gpa', 'grade', 'college', 'marks', 'academic'],
    popular: true,
    componentName: 'CgpaCalculator'
  },
  {
    id: 'attendance-calculator',
    title: 'Attendance Percentage Tracker',
    description: 'Find out how many classes you can miss or need to attend for target %.',
    category: 'student',
    icon: 'UserCheck',
    keywords: ['attendance', 'percentage', 'bunk', 'college', 'student'],
    popular: true,
    componentName: 'AttendanceCalculator'
  },
  {
    id: 'matrix-calculator',
    title: 'Matrix Mathematics Calculator',
    description: 'Perform matrix addition, multiplication, determinant, transpose & inverse.',
    category: 'student',
    icon: 'Grid3x3',
    keywords: ['matrix', 'determinant', 'algebra', 'math', 'linear'],
    componentName: 'MatrixCalculator'
  },
  {
    id: 'quadratic-solver',
    title: 'Quadratic Equation Solver',
    description: 'Solve ax² + bx + c = 0 with real and complex root solutions step-by-step.',
    category: 'student',
    icon: 'Variable',
    keywords: ['quadratic', 'algebra', 'equation', 'roots', 'math'],
    componentName: 'QuadraticSolver'
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage & Change Calculator',
    description: 'Compute percentage increases, decreases, relative changes, and fractions.',
    category: 'student',
    icon: 'Percent',
    keywords: ['percentage', 'math', 'increase', 'decrease', 'fraction'],
    popular: true,
    componentName: 'PercentageCalculator'
  },
  {
    id: 'fraction-calculator',
    title: 'Fraction Operator & Converter',
    description: 'Add, subtract, multiply, divide fractions and convert to mixed numbers.',
    category: 'student',
    icon: 'Divide',
    keywords: ['fraction', 'numerator', 'denominator', 'math'],
    componentName: 'FractionCalculator'
  },
  {
    id: 'stats-calculator',
    title: 'Standard Deviation & Variance',
    description: 'Calculate mean, median, mode, standard deviation, and variance for datasets.',
    category: 'student',
    icon: 'BarChart2',
    keywords: ['statistics', 'mean', 'median', 'std dev', 'variance'],
    componentName: 'StatsCalculator'
  },
  {
    id: 'prime-factorizer',
    title: 'Prime Factorizer & GCD / LCM',
    description: 'Find prime factors, Greatest Common Divisor (GCD), and Least Common Multiple.',
    category: 'student',
    icon: 'Binary',
    keywords: ['prime', 'factor', 'gcd', 'lcm', 'math', 'number'],
    componentName: 'PrimeFactorizer'
  },

  // FINANCE & BUSINESS
  {
    id: 'gst-calculator',
    title: 'GST & Sales Tax Calculator',
    description: 'Calculate Goods & Services Tax (Inclusive and Exclusive amounts).',
    category: 'finance',
    icon: 'Receipt',
    keywords: ['gst', 'tax', 'sales tax', 'vat', 'inclusive', 'exclusive'],
    popular: true,
    featured: true,
    componentName: 'GstCalculator'
  },
  {
    id: 'emi-calculator',
    title: 'EMI & Loan Amortization Calc',
    description: 'Calculate Equated Monthly Installment for home, car, or personal loans.',
    category: 'finance',
    icon: 'Landmark',
    keywords: ['emi', 'loan', 'interest', 'mortgage', 'monthly', 'finance'],
    popular: true,
    featured: true,
    componentName: 'EmiCalculator'
  },
  {
    id: 'sip-calculator',
    title: 'SIP & Mutual Fund Growth Calc',
    description: 'Estimate returns on Systematic Investment Plans with compound interest.',
    category: 'finance',
    icon: 'TrendingUp',
    keywords: ['sip', 'mutual fund', 'investment', 'compound', 'returns', 'wealth'],
    popular: true,
    componentName: 'SipCalculator'
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate investment growth with annual, monthly, or daily compounding.',
    category: 'finance',
    icon: 'DollarSign',
    keywords: ['compound', 'interest', 'savings', 'growth', 'finance'],
    popular: true,
    componentName: 'CompoundInterestCalculator'
  },
  {
    id: 'discount-calculator',
    title: 'Discount & Savings Calculator',
    description: 'Determine sale prices, coupon savings, and total discount percentages.',
    category: 'finance',
    icon: 'Tag',
    keywords: ['discount', 'sale', 'shopping', 'savings', 'coupon'],
    popular: true,
    componentName: 'DiscountCalculator'
  },
  {
    id: 'margin-calculator',
    title: 'Profit Margin & Markup Calc',
    description: 'Calculate gross profit margin, markup percentage, and selling prices.',
    category: 'finance',
    icon: 'PiggyBank',
    keywords: ['margin', 'markup', 'profit', 'business', 'pricing'],
    componentName: 'MarginCalculator'
  },
  {
    id: 'roi-calculator',
    title: 'Return on Investment (ROI)',
    description: 'Evaluate financial performance and gain ratios of business investments.',
    category: 'finance',
    icon: 'Briefcase',
    keywords: ['roi', 'investment', 'return', 'profit', 'business'],
    componentName: 'RoiCalculator'
  },
  {
    id: 'currency-converter',
    title: 'Offline & Live Currency Converter',
    description: 'Convert between world currencies with live or cached exchange rates.',
    category: 'finance',
    icon: 'Banknote',
    keywords: ['currency', 'exchange', 'forex', 'usd', 'eur', 'inr', 'gbp'],
    popular: true,
    featured: true,
    componentName: 'CurrencyConverter'
  },

  // HEALTH & FITNESS
  {
    id: 'bmi-calculator',
    title: 'BMI (Body Mass Index) Calc',
    description: 'Calculate body mass index and healthy weight categories according to WHO.',
    category: 'health',
    icon: 'HeartPulse',
    keywords: ['bmi', 'weight', 'health', 'fitness', 'body', 'height'],
    popular: true,
    featured: true,
    componentName: 'BmiCalculator'
  },
  {
    id: 'bmr-tdee-calculator',
    title: 'BMR & TDEE Calorie Calculator',
    description: 'Find Basal Metabolic Rate and Total Daily Energy Expenditure for weight loss/gain.',
    category: 'health',
    icon: 'Flame',
    keywords: ['bmr', 'tdee', 'calories', 'metabolism', 'diet', 'fitness'],
    popular: true,
    componentName: 'BmrTdeeCalculator'
  },
  {
    id: 'water-intake',
    title: 'Water Intake Calculator & Reminder',
    description: 'Calculate ideal daily water intake based on weight and activity level.',
    category: 'health',
    icon: 'Droplets',
    keywords: ['water', 'hydration', 'health', 'intake', 'reminder'],
    popular: true,
    componentName: 'WaterIntakeCalculator'
  },
  {
    id: 'heart-rate-calculator',
    title: 'Target Heart Rate Zones Calc',
    description: 'Calculate fat-burning and cardio target heart rate training zones.',
    category: 'health',
    icon: 'Activity',
    keywords: ['heart', 'pulse', 'cardio', 'fitness', 'workout'],
    componentName: 'HeartRateCalculator'
  },

  // TEXT & TYPOGRAPHY
  {
    id: 'case-converter',
    title: 'Case Converter & Format',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, etc.',
    category: 'text',
    icon: 'Type',
    keywords: ['case', 'uppercase', 'lowercase', 'camelcase', 'snakecase', 'text'],
    popular: true,
    featured: true,
    componentName: 'CaseConverter'
  },
  {
    id: 'word-counter',
    title: 'Word, Character & Sentence Counter',
    description: 'Real-time text analysis: words, characters, sentences, reading time, density.',
    category: 'text',
    icon: 'FileText',
    keywords: ['word', 'character', 'counter', 'length', 'reading time', 'text'],
    popular: true,
    componentName: 'WordCounter'
  },
  {
    id: 'markdown-preview',
    title: 'Markdown Live Previewer',
    description: 'Write GFM Markdown with instant side-by-side rendered visual preview.',
    category: 'text',
    icon: 'FileCode',
    keywords: ['markdown', 'preview', 'gfm', 'editor', 'text', 'html'],
    popular: true,
    componentName: 'MarkdownPreviewer'
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences, words, or lists.',
    category: 'text',
    icon: 'AlignLeft',
    keywords: ['lorem', 'ipsum', 'text', 'placeholder', 'dummy', 'generate'],
    popular: true,
    componentName: 'LoremIpsumGenerator'
  },
  {
    id: 'speech-time',
    title: 'Speech & Presentation Timer',
    description: 'Estimate spoken presentation duration based on word count and talking speed.',
    category: 'text',
    icon: 'Mic',
    keywords: ['speech', 'timer', 'presentation', 'words', 'duration'],
    componentName: 'SpeechTimeEstimator'
  },
  {
    id: 'text-cleaner',
    title: 'Text Cleaner & De-duplicator',
    description: 'Remove duplicate lines, extra spaces, line breaks, or specific symbols.',
    category: 'text',
    icon: 'Eraser',
    keywords: ['clean', 'text', 'duplicate', 'trim', 'lines', 'spaces'],
    componentName: 'TextCleaner'
  },

  // COLOR & DESIGN
  {
    id: 'gradient-generator',
    title: 'CSS Liquid Gradient Generator',
    description: 'Design multi-stop CSS gradients with copyable CSS, angle controls & presets.',
    category: 'color',
    icon: 'Palette',
    keywords: ['gradient', 'css', 'color', 'background', 'design', 'generator'],
    popular: true,
    featured: true,
    componentName: 'GradientGenerator'
  },
  {
    id: 'color-picker-converter',
    title: 'HEX / RGB / HSL Color Converter',
    description: 'Convert between HEX, RGB, HSL, HSV, and CMYK color space values.',
    category: 'color',
    icon: 'Pipette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'picker', 'converter'],
    popular: true,
    componentName: 'ColorConverter'
  },
  {
    id: 'contrast-checker',
    title: 'WCAG Color Contrast Checker',
    description: 'Check foreground/background text contrast ratios for AAA/AA compliance.',
    category: 'color',
    icon: 'Eye',
    keywords: ['contrast', 'wcag', 'accessibility', 'a11y', 'color', 'checker'],
    componentName: 'ContrastChecker'
  },
  {
    id: 'aspect-ratio',
    title: 'Aspect Ratio & Dimension Calc',
    description: 'Calculate responsive image/video dimensions (16:9, 4:3, 1:1, etc.).',
    category: 'color',
    icon: 'Maximize',
    keywords: ['aspect ratio', 'dimension', 'width', 'height', 'video', 'image'],
    componentName: 'AspectRatioCalculator'
  },
  {
    id: 'px-rem-converter',
    title: 'PX to REM / EM Unit Converter',
    description: 'Convert design pixel measurements to responsive CSS rem and em units.',
    category: 'color',
    icon: 'Ruler',
    keywords: ['px', 'rem', 'em', 'css', 'font', 'responsive'],
    componentName: 'PxRemConverter'
  },

  // SECURITY & RANDOM
  {
    id: 'password-generator',
    title: 'Ultra-Secure Password Generator',
    description: 'Create customizable cryptographic passwords with symbols, numbers & custom rules.',
    category: 'security',
    icon: 'ShieldAlert',
    keywords: ['password', 'secure', 'random', 'generator', 'security'],
    popular: true,
    featured: true,
    componentName: 'PasswordGenerator'
  },
  {
    id: 'password-strength',
    title: 'Password Strength Analyzer',
    description: 'Analyze entropy, crack duration estimate, and security vulnerabilities.',
    category: 'security',
    icon: 'Lock',
    keywords: ['password', 'strength', 'security', 'entropy', 'checker'],
    popular: true,
    componentName: 'PasswordStrengthChecker'
  },
  {
    id: 'coin-flip',
    title: '3D Interactive Coin Flip',
    description: 'Simulate realistic physics-based 3D heads or tails coin flips.',
    category: 'security',
    icon: 'CircleDot',
    keywords: ['coin', 'flip', 'random', 'decision', 'heads', 'tails'],
    popular: true,
    componentName: 'CoinFlip'
  },
  {
    id: 'dice-roller',
    title: '3D Dice Roller Simulator',
    description: 'Roll single or multiple 6-sided, 20-sided tabletop RPG dice with animations.',
    category: 'security',
    icon: 'Dices',
    keywords: ['dice', 'roll', 'random', 'rpg', 'd20', 'game'],
    popular: true,
    componentName: 'DiceRoller'
  },
  {
    id: 'decision-wheel',
    title: 'Custom Decision Spinner Wheel',
    description: 'Input your choices and spin the wheel for fair random decision making.',
    category: 'security',
    icon: 'Disc',
    keywords: ['wheel', 'spin', 'decision', 'picker', 'random', 'choice'],
    popular: true,
    featured: true,
    componentName: 'DecisionWheel'
  },

  // QR & BARCODE
  {
    id: 'qr-generator',
    title: 'Custom Glass QR Code Generator',
    description: 'Generate high-res QR codes for URLs, WiFi, VCards, and Text with logos.',
    category: 'qr',
    icon: 'QrCode',
    keywords: ['qr', 'qrcode', 'generator', 'wifi', 'vcard', 'barcode'],
    popular: true,
    featured: true,
    componentName: 'QrGenerator'
  },
  {
    id: 'qr-scanner',
    title: 'Camera QR Code Scanner',
    description: 'Scan QR codes instantly using webcam or uploaded image files offline.',
    category: 'qr',
    icon: 'Scan',
    keywords: ['qr', 'scan', 'camera', 'reader', 'decode'],
    popular: true,
    componentName: 'QrScanner'
  },
  {
    id: 'barcode-generator',
    title: 'Barcode Generator (Code128 / EAN)',
    description: 'Generate standard retail and inventory barcodes with download formats.',
    category: 'qr',
    icon: 'Barcode',
    keywords: ['barcode', 'code128', 'ean', 'upc', 'retail', 'generator'],
    componentName: 'BarcodeGenerator'
  },

  // TIME & DATE
  {
    id: 'age-calculator',
    title: 'Exact Age & Milestone Calc',
    description: 'Compute precise age in years, months, days, hours, and next birthday countdown.',
    category: 'time',
    icon: 'Calendar',
    keywords: ['age', 'birthday', 'date', 'years', 'months', 'days'],
    popular: true,
    featured: true,
    componentName: 'AgeCalculator'
  },
  {
    id: 'timezone-converter',
    title: 'World Clock & Timezone Converter',
    description: 'Compare hours across major global timezones simultaneously.',
    category: 'time',
    icon: 'Globe',
    keywords: ['timezone', 'world clock', 'gmt', 'utc', 'time', 'converter'],
    popular: true,
    componentName: 'TimezoneConverter'
  },
  {
    id: 'stopwatch',
    title: 'Precision Stopwatch & Lap Counter',
    description: 'Millisecond-accurate digital stopwatch with lap breakdown.',
    category: 'time',
    icon: 'Timer',
    keywords: ['stopwatch', 'timer', 'lap', 'time', 'sports'],
    popular: true,
    componentName: 'Stopwatch'
  },
  {
    id: 'pomodoro-timer',
    title: 'Pomodoro Focus Timer & Ambient Audio',
    description: 'Boost productivity with customizable work intervals and break notifications.',
    category: 'time',
    icon: 'Hourglass',
    keywords: ['pomodoro', 'timer', 'focus', 'break', 'productivity'],
    popular: true,
    featured: true,
    componentName: 'PomodoroTimer'
  },

  // CONVERTERS
  {
    id: 'unit-converter',
    title: 'Universal Multi-Unit Converter',
    description: 'Convert Length, Mass, Temperature, Volume, Speed, and Area units.',
    category: 'converters',
    icon: 'ArrowLeftRight',
    keywords: ['unit', 'converter', 'length', 'weight', 'temperature', 'volume'],
    popular: true,
    featured: true,
    componentName: 'UnitConverter'
  },
  {
    id: 'file-size-converter',
    title: 'Digital File Size & Storage Calc',
    description: 'Convert between Bytes, KB, MB, GB, TB, and binary vs decimal multiples.',
    category: 'converters',
    icon: 'HardDrive',
    keywords: ['file size', 'bytes', 'kb', 'mb', 'gb', 'converter'],
    popular: true,
    componentName: 'FileSizeConverter'
  },

  // MEDIA & IMAGE
  {
    id: 'image-compressor',
    title: 'Browser Image Compressor',
    description: 'Compress PNG, JPG, and WebP files offline right in your browser.',
    category: 'media',
    icon: 'Minimize',
    keywords: ['image', 'compress', 'optimize', 'jpg', 'png', 'webp'],
    popular: true,
    featured: true,
    componentName: 'ImageCompressor'
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer & Format Converter',
    description: 'Resize pixel dimensions and convert images to PNG, WEBP, or JPEG.',
    category: 'media',
    icon: 'Scaling',
    keywords: ['resize', 'image', 'dimensions', 'format', 'convert'],
    popular: true,
    componentName: 'ImageResizer'
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    description: 'Combine multiple image files into a clean downloadable PDF document.',
    category: 'media',
    icon: 'FileImage',
    keywords: ['image', 'pdf', 'convert', 'combine', 'pictures'],
    popular: true,
    componentName: 'ImageToPdf'
  },

  // PRODUCTIVITY
  {
    id: 'habit-tracker',
    title: 'Daily Habit Tracker & Streaks',
    description: 'Track daily habits, measure current streaks, and analyze consistency graphs.',
    category: 'productivity',
    icon: 'CheckCircle2',
    keywords: ['habit', 'tracker', 'streak', 'routine', 'goals'],
    popular: true,
    featured: true,
    componentName: 'HabitTracker'
  },
  {
    id: 'quick-notes',
    title: 'Glass Quick Notes & Markdown',
    description: 'Offline markdown notes notepad with instant search and local IndexedDB auto-save.',
    category: 'productivity',
    icon: 'Notebook',
    keywords: ['notes', 'notepad', 'markdown', 'memo', 'save'],
    popular: true,
    featured: true,
    componentName: 'QuickNotes'
  },
  {
    id: 'expense-tracker',
    title: 'Expense & Budget Planner',
    description: 'Log daily expenses, track monthly category spending with visual pie charts.',
    category: 'productivity',
    icon: 'Wallet',
    keywords: ['expense', 'budget', 'money', 'tracker', 'finance', 'chart'],
    popular: true,
    featured: true,
    componentName: 'ExpenseTracker'
  },
  {
    id: 'glass-canvas',
    title: 'Glass Canvas Whiteboard',
    description: 'Draw, sketch, add shapes, sticky notes, and map minds on a premium VisionOS transparent canvas.',
    category: 'productivity',
    icon: 'Brush',
    keywords: ['whiteboard', 'canvas', 'draw', 'sketch', 'mindmap', 'shapes', 'notes'],
    popular: true,
    featured: true,
    componentName: 'GlassCanvas'
  },

  // SYSTEM & NETWORK
  {
    id: 'battery-info',
    title: 'System Battery Diagnostics',
    description: 'Inspect live device battery level, charging status, and estimated runtime.',
    category: 'system',
    icon: 'BatteryCharging',
    keywords: ['battery', 'charge', 'system', 'diagnostics', 'power'],
    popular: true,
    componentName: 'BatteryInfo'
  },
  {
    id: 'network-info',
    title: 'Network & Internet Speed Test',
    description: 'Check online status, network latency ping, downlink speed & IP info.',
    category: 'system',
    icon: 'Wifi',
    keywords: ['network', 'speed', 'ping', 'wifi', 'ip', 'connection'],
    popular: true,
    componentName: 'NetworkInfo'
  }
];
