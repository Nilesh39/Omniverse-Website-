export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count?: number;
}

export const CATEGORIES: ToolCategory[] = [
  { id: 'developer', name: 'Developer & Code', description: 'JSON, JWT, Regex, Base64, Hashes, Minifiers, Formatting', icon: 'Code2', color: 'from-cyan-500 to-blue-600' },
  { id: 'student', name: 'Student & Academics', description: 'CGPA, Attendance, Matrix, Quadratic, Math & Study Tools', icon: 'GraduationCap', color: 'from-purple-500 to-indigo-600' },
  { id: 'finance', name: 'Finance & Money', description: 'GST, EMI, SIP, Compound Interest, Loans, Margins & ROI', icon: 'Coins', color: 'from-emerald-500 to-teal-600' },
  { id: 'health', name: 'Health & Fitness', description: 'BMI, BMR/TDEE, Water Reminder, Heart Rate, Calories', icon: 'Activity', color: 'from-rose-500 to-red-600' },
  { id: 'text', name: 'Text & Writing', description: 'Case Converter, Word Counter, Markdown, Speech Estimator', icon: 'FileText', color: 'from-amber-500 to-orange-600' },
  { id: 'color', name: 'Color & Design', description: 'Gradients, Color Converter, Contrast Checker, Aspect Ratio', icon: 'Palette', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'security', name: 'Security & Random', description: 'Password Generator, Strength Analyzer, Hashes, Coin Flip', icon: 'ShieldCheck', color: 'from-blue-500 to-cyan-600' },
  { id: 'qr', name: 'QR & Barcode', description: 'Custom QR Generator, Scanner, Barcode Code128 / EAN', icon: 'QrCode', color: 'from-violet-500 to-purple-600' },
  { id: 'time', name: 'Time & Date', description: 'Age Calc, Timezone Converter, Stopwatch, Pomodoro, Timers', icon: 'Clock', color: 'from-indigo-500 to-sky-600' },
  { id: 'converters', name: 'Unit & Data Converters', description: 'Length, Weight, Temp, Digital Storage, Transfer Speed', icon: 'ArrowLeftRight', color: 'from-teal-500 to-emerald-600' },
  { id: 'media', name: 'Image & Media', description: 'Image Compressor, Resizer, Cropper, Filters, Image to PDF', icon: 'Image', color: 'from-pink-500 to-rose-600' },
  { id: 'productivity', name: 'Productivity & Planning', description: 'Habit Tracker, Notes, Expense Planner, Flashcards, Checklist', icon: 'CheckSquare', color: 'from-sky-500 to-blue-600' },
  { id: 'system', name: 'System & Network', description: 'Battery Diagnostics, Storage Analyzer, Network Info, Speed Test', icon: 'Cpu', color: 'from-slate-500 to-zinc-600' }
];
