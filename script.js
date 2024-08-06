const inputDay = document.getElementById("input-day");
const inputMonth = document.getElementById("input-month");
const inputYear = document.getElementById("input-year");
const allInputs = document.querySelectorAll("input[type=text].form-control");

const confirmBtn = document.getElementById("confirm-btn");

const outputDaySpan = document.getElementById("output-day");
const outputMonthSpan = document.getElementById("output-month");
const outputYearSpan = document.getElementById("output-year");

const date = new Date();

/* inputs */
const addInputsEvents = (item) => {
  /* preventKeyPress */
  item.addEventListener("keypress", (e) => {
    const allowedCharsRegex = /[0-9]+/;
    if (!allowedCharsRegex.test(e.key)) {
      e.preventDefault();
    }
  });

  /* inputEvent */
  item.addEventListener("input", () => {
    const parentElement = item.parentElement;

    parentElement.classList.remove("clr-error");
  });
};

allInputs.forEach((item) => {
  addInputsEvents(item);
});

/* btn */
confirmBtn.addEventListener("click", () => {
  resetAllErrorMsgs();
  checkInputValidation();
});

const checkInputValidation = () => {
  const inputDayValue = Number(inputDay.value);
  const inputMonthValue = Number(inputMonth.value);
  const inputYearValue = Number(inputYear.value);
  let isValidDay = false;
  let isValidMonth = false;
  let isValidYear = false;
  const currentYear = date.getFullYear();
  const lastDayMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  allInputs.forEach((item) => {
    if (item.validity.valueMissing) {
      showErrorMsg(item.id, "This field is required");
    } else {
      switch (item.id) {
        case "input-day":
          isValidDay =
            item.value > 0 && item.value <= 31
              ? true
              : showErrorMsg(item.id, "Must be a valid day");
          break;
        case "input-month":
          isValidMonth =
            item.value > 0 && item.value <= 12
              ? true
              : showErrorMsg(item.id, "Must be a valid month");
          break;
        case "input-year":
          isValidYear =
            item.value <= currentYear
              ? true
              : showErrorMsg(item.id, "Must be in the past");
          break;
      }
    }

    if (isValidDay && isValidMonth && isValidYear) {
      if (inputYearValue % 4 === 0) {
        lastDayMonth[1] = 29;
      }

      if (inputDayValue <= lastDayMonth[inputMonthValue - 1]) {
        calculateAge(
          inputDayValue,
          inputMonthValue,
          inputYearValue,
          lastDayMonth
        );
      } else {
        showErrorMsg("input-day", "Must be a valid date");
        showErrorMsg("input-month", "");
        showErrorMsg("input-year", "");
      }
    }
  });
};

const calculateAge = (
  inputDayValue,
  inputMonthValue,
  inputYearValue,
  lastDayMonth
) => {
  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  let fullYears = currentYear - inputYearValue;
  let fullMonths;
  let fullDays;

  if (currentMonth < inputMonthValue) {
    fullYears--;
    fullMonths = currentMonth + 12 - inputMonthValue;
  } else {
    fullMonths = currentMonth - inputMonthValue;
  }

  if (currentDay < inputDayValue) {
    fullMonths--;
    fullDays = currentDay + lastDayMonth[inputMonthValue - 2] - inputDayValue;
  } else {
    fullDays = currentDay - inputDayValue;
  }
  console.log(`${fullYears} years, ${fullMonths} months, ${fullDays} days`);
  updateOutputs(fullYears, fullMonths, fullDays);
};

const updateOutputs = (fullYears, fullMonths, fullDays) => {
  outputYearSpan.textContent = fullYears;
  outputMonthSpan.textContent = fullMonths;
  outputDaySpan.textContent = fullDays;
};

const showErrorMsg = (id, msg) => {
  const parentElement = document.getElementById(`${id}`).parentElement;
  parentElement.classList.add("clr-error");

  document.querySelector(`#${id} ~ .invalid-msg`).textContent = msg;
  updateOutputs("- -", "- -", "- -");
};

const resetAllErrorMsgs = () => {
  allInputs.forEach((item) => {
    const parentElement = document.getElementById(`${item.id}`).parentElement;
    parentElement.classList.remove("clr-error");

    document.querySelector(`#${item.id} ~ .invalid-msg`).textContent = "";
  });
};
