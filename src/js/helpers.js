import { TIMEOUT_SECONDS } from './config.js';

/**
 * Converts a decimal number to a string representation in fractional format
 * @param {Number} number a number input which is supposed to be converter to a string
 * @returns {String} a fractional formatted string is returned
 * @author Sagnik Ghosh
 */
export const formatFraction = number => {
  // Handle integer numbers
  if (Number.isInteger(number)) {
    return number.toString(); // Just return the integer as a string
  }

  // Split the number into integer and decimal parts
  const integerPart = Math.floor(number); // The whole number part
  const decimalPart = number - integerPart; // The fractional part

  // Convert the decimal part to a fraction
  const decimalStr = decimalPart.toString();
  const decimalPlaces = decimalStr.split('.')[1]?.length || 0;
  const denom = Math.pow(10, decimalPlaces);
  const numer = Math.round(decimalPart * denom);

  // Simplify the fraction
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numer, denom);
  const simplifiedNumer = numer / divisor;
  const simplifiedDenom = denom / divisor;

  // returning the fraction format
  return `${integerPart} ${simplifiedNumer}/${simplifiedDenom}`;
};

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchRequest = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};
/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchRequest = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};
*/
