
"use strict";

/* =========================================
   ByteShift — Data Unit Converter
   CyberFriday v1.0
   ========================================= */

// Conversion factors relative to one byte.

const UNITS = Object.freeze({
  // Bits
  bit: 1 / 8,
  kbit: 1000 / 8,
  Mbit: 1e6 / 8,
  Gbit: 1e9 / 8,

  // Decimal bytes (SI)
  B: 1,
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,

  // Binary bytes (IEC)
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4
});

// Elements

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from-unit");
const toSelect = document.getElementById("to-unit");

const resultOutput = document.getElementById("result");
const resultUnit = document.getElementById("result-unit");
const formulaOutput = document.getElementById("formula");

const swapButton = document.getElementById("swap-btn");
const resetButton = document.getElementById("reset-btn");
const copyButton = document.getElementById("copy-btn");
const statusOutput = document.getElementById("status");

// Format numbers for display.

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Invalid result";
  }

  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 12,
    useGrouping: true
  }).format(value);
}

// Convert between two units.

function convert(value, from, to) {
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    !Object.hasOwn(UNITS, from) ||
    !Object.hasOwn(UNITS, to)
  ) {
    return NaN;
  }

  return value * UNITS[from] / UNITS[to];
}

// Current result, used by copy function.

let currentResult = NaN;

// Calculate and update the interface.

function updateConverter() {
  const rawValue = amountInput.value.trim();

  const from = fromSelect.value;
  const to = toSelect.value;

  statusOutput.textContent = "";

  // Empty or invalid input.
  if (rawValue === "") {
    showInvalid("Enter a value.");
    return;
  }

  const amount = Number(rawValue);

  if (!Number.isFinite(amount) || amount < 0) {
    showInvalid("Enter a valid non-negative number.");
    return;
  }

  const result = convert(amount, from, to);

  if (!Number.isFinite(result)) {
    showInvalid("Value is outside the supported range.");
    return;
  }

  currentResult = result;

  resultOutput.textContent = formatNumber(result);
  resultUnit.textContent = to;

  // Formula based on one source unit.
  const oneUnit = convert(1, from, to);

  formulaOutput.textContent =
    `1 ${from} = ${formatNumber(oneUnit)} ${to}`;

  copyButton.disabled = false;
}

// Display invalid state.

function showInvalid(message) {
  currentResult = NaN;

  resultOutput.textContent = "—";
  resultUnit.textContent = "";
  formulaOutput.textContent = message;

  copyButton.disabled = true;
}

// Swap source and target units.

function swapUnits() {
  const previousFrom = fromSelect.value;

  fromSelect.value = toSelect.value;
  toSelect.value = previousFrom;

  updateConverter();
}

// Reset to default values.

function resetConverter() {
  amountInput.value = "8";
  fromSelect.value = "GiB";
  toSelect.value = "GB";

  updateConverter();
}

// Copy the result to clipboard.

async function copyResult() {
  if (!Number.isFinite(currentResult)) {
    return;
  }

  const resultText =
    `${formatNumber(currentResult)} ${toSelect.value}`;

  try {
    await navigator.clipboard.writeText(resultText);

    statusOutput.textContent = "Result copied!";
  } catch (error) {
    statusOutput.textContent =
      "Clipboard unavailable. Select and copy the result.";
  }
}

// Event listeners.

amountInput.addEventListener("input", updateConverter);

fromSelect.addEventListener("change", updateConverter);

toSelect.addEventListener("change", updateConverter);

swapButton.addEventListener("click", swapUnits);

resetButton.addEventListener("click", resetConverter);

copyButton.addEventListener("click", copyResult);

// Initial calculation.

updateConverter();
