import React from 'react';
import {
  JsonFormatterTool,
  JwtDecoderTool,
  RegexTesterTool,
  Base64ConverterTool,
  HashGeneratorTool,
  UuidGeneratorTool,
  HtmlEscaperTool,
  SqlFormatterTool,
  UrlEncoderTool,
  CodeMinifierTool,
  CronParserTool,
  DiffCheckerTool
} from '../../tools/DeveloperTools';

import {
  ScientificCalculatorTool,
  CgpaCalculatorTool,
  AttendanceCalculatorTool,
  PercentageCalculatorTool,
  MatrixCalculatorTool,
  QuadraticSolverTool,
  FractionCalculatorTool,
  StatsCalculatorTool,
  PrimeFactorizerTool,
  GraphingCalculatorTool,
  GravitySimulatorTool
} from '../../tools/MathStudentTools';

import {
  GstCalculatorTool,
  EmiCalculatorTool,
  SipCalculatorTool,
  CompoundInterestCalculatorTool,
  DiscountCalculatorTool,
  MarginCalculatorTool,
  RoiCalculatorTool,
  CurrencyConverterTool,
  SplitBillsTool
} from '../../tools/FinanceTools';

import {
  BmiCalculatorTool,
  BmrTdeeCalculatorTool,
  WaterIntakeCalculatorTool,
  HeartRateCalculatorTool
} from '../../tools/HealthTools';

import {
  CaseConverterTool,
  WordCounterTool,
  MarkdownPreviewerTool,
  LoremIpsumGeneratorTool,
  SpeechTimeEstimatorTool,
  TextCleanerTool,
  DevTypingSpeedRacerTool
} from '../../tools/TextTools';

import {
  GradientGeneratorTool,
  ColorConverterTool,
  ContrastCheckerTool,
  AspectRatioCalculatorTool,
  PxRemConverterTool,
  PasswordGeneratorTool,
  PasswordStrengthCheckerTool,
  CoinFlipTool,
  DiceRollerTool,
  DecisionWheelTool
} from '../../tools/ColorSecurityTools';

import {
  QrGeneratorTool,
  QrScannerTool,
  BarcodeGeneratorTool
} from '../../tools/QrBarcodeTools';

import {
  AgeCalculatorTool,
  TimezoneConverterTool,
  StopwatchTool,
  PomodoroTimerTool
} from '../../tools/TimeDateTools';

import {
  UnitConverterTool,
  FileSizeConverterTool
} from '../../tools/ConverterTools';

import {
  ImageCompressorTool,
  ImageResizerTool,
  ImageToPdfTool
} from '../../tools/MediaTools';

import {
  HabitTrackerTool,
  QuickNotesTool,
  ExpenseTrackerTool,
  GlassCanvasTool,
  SudokuGameTool,
  RubiksCubeTool
} from '../../tools/ProductivityTools';

import {
  BatteryInfoTool,
  NetworkInfoTool,
  CompassTool
} from '../../tools/SystemTools';

interface ToolRendererProps {
  componentName: string;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ componentName }) => {
  switch (componentName) {
    // Developer
    case 'JsonFormatter': return <JsonFormatterTool />;
    case 'JwtDecoder': return <JwtDecoderTool />;
    case 'RegexTester': return <RegexTesterTool />;
    case 'Base64Converter': return <Base64ConverterTool />;
    case 'HashGenerator': return <HashGeneratorTool />;
    case 'UuidGenerator': return <UuidGeneratorTool />;
    case 'HtmlEscaper': return <HtmlEscaperTool />;
    case 'SqlFormatter': return <SqlFormatterTool />;
    case 'UrlEncoder': return <UrlEncoderTool />;
    case 'CodeMinifier': return <CodeMinifierTool />;
    case 'CronParser': return <CronParserTool />;
    case 'DiffChecker': return <DiffCheckerTool />;

    // Student & Math
    case 'ScientificCalculator': return <ScientificCalculatorTool />;
    case 'CgpaCalculator': return <CgpaCalculatorTool />;
    case 'AttendanceCalculator': return <AttendanceCalculatorTool />;
    case 'PercentageCalculator': return <PercentageCalculatorTool />;
    case 'MatrixCalculator': return <MatrixCalculatorTool />;
    case 'QuadraticSolver': return <QuadraticSolverTool />;
    case 'FractionCalculator': return <FractionCalculatorTool />;
    case 'StatsCalculator': return <StatsCalculatorTool />;
    case 'PrimeFactorizer': return <PrimeFactorizerTool />;
    case 'GraphingCalculator': return <GraphingCalculatorTool />;
    case 'GravitySimulator': return <GravitySimulatorTool />;

    // Finance
    case 'GstCalculator': return <GstCalculatorTool />;
    case 'EmiCalculator': return <EmiCalculatorTool />;
    case 'SipCalculator': return <SipCalculatorTool />;
    case 'CompoundInterestCalculator': return <CompoundInterestCalculatorTool />;
    case 'DiscountCalculator': return <DiscountCalculatorTool />;
    case 'MarginCalculator': return <MarginCalculatorTool />;
    case 'RoiCalculator': return <RoiCalculatorTool />;
    case 'CurrencyConverter': return <CurrencyConverterTool />;
    case 'SplitBills': return <SplitBillsTool />;

    // Health
    case 'BmiCalculator': return <BmiCalculatorTool />;
    case 'BmrTdeeCalculator': return <BmrTdeeCalculatorTool />;
    case 'WaterIntakeCalculator': return <WaterIntakeCalculatorTool />;
    case 'HeartRateCalculator': return <HeartRateCalculatorTool />;

    // Text
    case 'CaseConverter': return <CaseConverterTool />;
    case 'WordCounter': return <WordCounterTool />;
    case 'MarkdownPreviewer': return <MarkdownPreviewerTool />;
    case 'LoremIpsumGenerator': return <LoremIpsumGeneratorTool />;
    case 'SpeechTimeEstimator': return <SpeechTimeEstimatorTool />;
    case 'TextCleaner': return <TextCleanerTool />;
    case 'DevTypingSpeedRacer': return <DevTypingSpeedRacerTool />;

    // Color & Security
    case 'GradientGenerator': return <GradientGeneratorTool />;
    case 'ColorConverter': return <ColorConverterTool />;
    case 'ContrastChecker': return <ContrastCheckerTool />;
    case 'AspectRatioCalculator': return <AspectRatioCalculatorTool />;
    case 'PxRemConverter': return <PxRemConverterTool />;
    case 'PasswordGenerator': return <PasswordGeneratorTool />;
    case 'PasswordStrengthChecker': return <PasswordStrengthCheckerTool />;
    case 'CoinFlip': return <CoinFlipTool />;
    case 'DiceRoller': return <DiceRollerTool />;
    case 'DecisionWheel': return <DecisionWheelTool />;

    // QR & Barcode
    case 'QrGenerator': return <QrGeneratorTool />;
    case 'QrScanner': return <QrScannerTool />;
    case 'BarcodeGenerator': return <BarcodeGeneratorTool />;

    // Time & Date
    case 'AgeCalculator': return <AgeCalculatorTool />;
    case 'TimezoneConverter': return <TimezoneConverterTool />;
    case 'Stopwatch': return <StopwatchTool />;
    case 'PomodoroTimer': return <PomodoroTimerTool />;

    // Converters
    case 'UnitConverter': return <UnitConverterTool />;
    case 'FileSizeConverter': return <FileSizeConverterTool />;

    // Media
    case 'ImageCompressor': return <ImageCompressorTool />;
    case 'ImageResizer': return <ImageResizerTool />;
    case 'ImageToPdf': return <ImageToPdfTool />;

    // Productivity
    case 'HabitTracker': return <HabitTrackerTool />;
    case 'QuickNotes': return <QuickNotesTool />;
    case 'ExpenseTracker': return <ExpenseTrackerTool />;
    case 'GlassCanvas': return <GlassCanvasTool />;
    case 'SudokuGame': return <SudokuGameTool />;
    case 'RubiksCube': return <RubiksCubeTool />;

    // System
    case 'BatteryInfo': return <BatteryInfoTool />;
    case 'NetworkInfo': return <NetworkInfoTool />;
    case 'Compass': return <CompassTool />;

    default:
      return <PercentageCalculatorTool />;
  }
};
