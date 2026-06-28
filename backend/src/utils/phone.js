const { parsePhoneNumberFromString } = require("libphonenumber-js");

function isValidPhone(phone, defaultCountry = "FR") {
  if (!phone) return true;

  const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);

  return phoneNumber ? phoneNumber.isValid() : false;
}

function normalizePhone(phone, defaultCountry = "FR") {
  if (!phone) return null;

  const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);

  if (!phoneNumber || !phoneNumber.isValid()) {
    return null;
  }

  return phoneNumber.number;
}

module.exports = {
  isValidPhone,
  normalizePhone,
};
