const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

const lengthInput = document.querySelector("#lengthInput");
const lengthValue = document.querySelector("#lengthValue");
const passwordOutput = document.querySelector("#passwordOutput");
const generateButton = document.querySelector("#generateButton");
const copyButton = document.querySelector("#copyButton");
const copyMessage = document.querySelector("#copyMessage");
const strengthLabel = document.querySelector("#strengthLabel");
const strengthBar = document.querySelector("#strengthBar");
const optionInputs = Array.from(document.querySelectorAll(".check-option input"));

function getRandomIndex(max) {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  return randomValues[0] % max;
}

function shuffleCharacters(characters) {
  const list = characters.split("");

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }

  return list.join("");
}

function getSelectedSets() {
  return optionInputs
    .filter((input) => input.checked)
    .map((input) => characterSets[input.id]);
}

function estimateStrength(length, selectedCount) {
  const score = length + selectedCount * 4;

  if (score >= 28) {
    return { label: "Excellent", width: "100%", color: "var(--success)" };
  }

  if (score >= 22) {
    return { label: "Strong", width: "78%", color: "var(--brand)" };
  }

  if (score >= 16) {
    return { label: "Moderate", width: "54%", color: "var(--warning)" };
  }

  return { label: "Basic", width: "32%", color: "var(--danger)" };
}

function updateStrength() {
  const selectedSets = getSelectedSets();
  const strength = estimateStrength(Number(lengthInput.value), selectedSets.length);

  strengthLabel.textContent = strength.label;
  strengthBar.style.width = strength.width;
  strengthBar.style.background = strength.color;
}

function generatePassword() {
  const selectedSets = getSelectedSets();
  const length = Number(lengthInput.value);

  if (selectedSets.length === 0) {
    passwordOutput.value = "";
    strengthLabel.textContent = "Select one";
    strengthBar.style.width = "0%";
    copyMessage.textContent = "Choose at least one character type.";
    return;
  }

  const requiredCharacters = selectedSets.map((set) => set[getRandomIndex(set.length)]);
  const allCharacters = selectedSets.join("");
  let password = requiredCharacters.join("");

  while (password.length < length) {
    password += allCharacters[getRandomIndex(allCharacters.length)];
  }

  passwordOutput.value = shuffleCharacters(password);
  copyMessage.textContent = "";
  updateStrength();
}

async function copyPassword() {
  if (!passwordOutput.value) {
    copyMessage.textContent = "Generate a password first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordOutput.value);
    copyMessage.textContent = "Password copied.";
  } catch {
    passwordOutput.select();
    document.execCommand("copy");
    copyMessage.textContent = "Password copied.";
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
  updateStrength();
});

optionInputs.forEach((input) => {
  input.addEventListener("change", () => {
    updateStrength();
    copyMessage.textContent = "";
  });
});

generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);

generatePassword();
